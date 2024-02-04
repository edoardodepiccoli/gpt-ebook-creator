import OpenAI from "openai";
import * as fs from "node:fs";

const openai = new OpenAI();

// parameters
let bookTopic = `History of The Ancient Egypt: The Mysteries of Tutankhamon's Life`;
// practical and actionable tips
let additionalInstructions =
  "offer high value insights, practical and actionable tips and use field-related vocabulary. Include facts and case studies to improve the credibility of the content.";
let numberOfChapters = 13;
let language = "italian";
let model = "gpt-4-0125-preview";

// history and final ebook
let chaptersHistory = "";
let ebook = "";

// main program
async function main() {
  //generate chapters
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `write the titles of the ${numberOfChapters} chapters of an ebook that talks about ${bookTopic}.`,
      },
      {
        role: "system",
        content: `write everything in ${language}`,
      },
    ],
    model: `${model}`,
  });

  console.log(completion.choices[0].message.content);
  chaptersHistory = completion.choices[0].message.content;

  async function runSequentially() {
    for (let i = 1; i < numberOfChapters + 1; i++) {
      console.log("**************" + i + "*************");
      async function generateText() {
        const completion = await openai.chat.completions.create({
          messages: [
            //ebook chapters
            { role: "user", content: chaptersHistory },
            //ebook so far
            { role: "assistant", content: ebook },
            //generate next chapter
            {
              role: "user",
              content: `write chapter ${i} using 450 words. 
                Write the chapter number and name of the chapter before writing the content.
                Write 3 paragraphs and don't separate them using an empty line.
                But just go to a new line.`,
            },
            {
              role: "system",
              content: `${additionalInstructions}`,
            },
            {
              role: "system",
              content: `write everything in ${language}`,
            },
          ],
          model: `${model}`,
        });

        console.log(completion.choices[0].message.content);
        ebook = ebook + completion.choices[0].message.content + "\n" + "\n";

        // generate tts - TOO EXPENSIVE!!!
        // const speechFile = path.resolve(`./speech${i}.mp3`);
        // const TTS = async function () {
        //   const mp3 = await openai.audio.speech.create({
        //     model: "tts-1",
        //     voice: "onyx",
        //     input: completion.choices[0].message.content,
        //   });
        //   console.log(speechFile);
        //   const buffer = Buffer.from(await mp3.arrayBuffer());
        //   await fs.promises.writeFile(speechFile, buffer);
        // };

        // TTS();
      }

      await generateText();
    }

    fs.writeFile("./test.txt", ebook, (err) => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
      }
    });
  }

  // Call the function to start the sequential execution
  runSequentially();
}
main();
