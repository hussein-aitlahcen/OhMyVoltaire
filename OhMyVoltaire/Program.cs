using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace OhMyVoltaire
{
    class Program
    {

        sealed class Sentence
        {
            public string Begin { get; set; }
            public string Correction { get; set; }
            public string End { get; set; }
        }

        static void Main(string[] args)
        {
            var regex = "([^\\[\\]\\\",]+)";
            var text = File.ReadAllText("data.js");
            var forbidden = new []
            {
                "com.google",
                "mon.collect",
                "com.woonoz.",
                "java."
            };
            var endOfSentences = new[]
            {
                '.',
                ')',
                '?',
                '!'
            };

            var goodSentences = new List<Sentence>();
            var lastSentences = new Stack<string>();

            foreach (Match match in Regex.Matches(text, regex))
            {
                if (forbidden.Any(f => match.Value.StartsWith(f)))
                    continue;

                // dunno why there is some string containing only uppercase letter and digits, around 43 character length
                if (match.Value.Any(c => !char.IsUpper(c) && !char.IsDigit(c)))
                {
                    // decode tha shit of html encoding and regex hexadecimals
                    var sentence = System.Web.HttpUtility.HtmlDecode(Regex.Unescape(match.Value));

                    // we should combine sentences only at the end, Dr. Obvious
                    var endOfSentence = sentence.Last();
                    if (!endOfSentences.Contains(endOfSentence))
                    {
                        lastSentences.Push(sentence);
                        continue;
                    }

                    // combines broken sentences into a normalized one (mean that it should include a uppercase character first and a final point)
                    var beginOfsentence = sentence.First();
                    while (
                        lastSentences.Count > 0 && (
                        !sentence.Any(char.IsLetter) || 
                        beginOfsentence == ' ' ||
                        beginOfsentence == (char)160 || 
                        (!char.IsUpper(sentence.First(char.IsLetter)) && !endOfSentences.Contains(beginOfsentence))))
                    {
                        var lastSentence = lastSentences.Pop();
                        sentence = lastSentence + sentence;
                        beginOfsentence = sentence.First();
                    }
                    
                    // find only good sentences
                    if (!sentence.Contains("<B>") || !sentence.Contains("</B>") || sentence.Contains('»') || sentence.Contains('«'))
                        continue;

                    Console.WriteLine(sentence);

                    var end = sentence.Substring(sentence.LastIndexOf("</B>") + 4);
                    var begin = sentence.Replace(sentence.Substring(sentence.IndexOf("<B>")), string.Empty);
                    var correction = sentence;
                    if (!string.IsNullOrWhiteSpace(begin))
                        correction = correction.Replace(begin, string.Empty);
                    if (!string.IsNullOrWhiteSpace(end))
                        correction = correction.Replace(end, string.Empty);

                    goodSentences.Add(new Sentence
                    {
                        Begin = begin,
                        Correction = correction,
                        End = end
                    });
                }
            }

            var cheatsheet = JsonConvert.SerializeObject(goodSentences);

            var template = File.ReadAllText("template.js");

            File.WriteAllText("OhMyVoltaire.js", template.Replace("[DUDE_REPLACE_THE_PONEY_MAN]", cheatsheet), Encoding.Default);

            Console.WriteLine("done");
            Console.Read();
        }
    }
}
