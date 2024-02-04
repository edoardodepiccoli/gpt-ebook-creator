import OpenAI from "openai";

const openai = new OpenAI();
let ebookTopic = "how to live well with your cat";
let chaptersArray = [];
let ebookTextArray = [];
let draft = "";

const main = async function () {
  const chaptersRawOutput = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "user",
        content: `write the titles of the 3 chapters of an ebook about ${ebookTopic}, 
        write everything in a single line (it's important that everything is in a single line) and saparate the chapter just using a @ character.
        Do not include chapters numbers and dots. 
        include an introduction chapter and an ending one`,
      },
    ],
  });
  let textOutput = chaptersRawOutput.choices[0].message.content;
  chaptersArray = textOutput.split("@");
  console.log(textOutput);
  console.log(chaptersArray);

  for (let i = 0; i < chaptersArray.length; i++) {
    const textRawOutput = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {
          role: "user",
          content: `write a 300 word chapter about an ebook that talks about ${ebookTopic}.
          The title of this chapter is ${chaptersArray[i]}. Make sure to only write the 300 words about that chapter and not writing anything else that is not relevant.
          Do not create subchapters but split the text in 3 main paragraphs. 
          Write the title of the chapter before the text content`,
        },
      ],
    });
    let textOutput = textRawOutput.choices[0].message.content;
    console.log(textOutput);
    ebookTextArray.push(textOutput);
    console.log(ebookTextArray);
  }
  for (let j = 0; j < ebookTextArray.length; j++) {
    console.log(ebookTextArray[j]);
    draft = draft + ebookTextArray[j];
  }
  refactor(draft);
};

const refactor = async function (text) {
  const textRawOutput = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "user",
        content: `rewrite this text (in around 3000 words) so it is more well written and ready to sell as an ebook:
            ${text}`,
      },
    ],
  });
  const finalEbook = textRawOutput.choices[0].message.content;
  console.log(finalEbook);
};

main();
