import OpenAI from "openai";

const openai = new OpenAI();

const ebookTopic = "how to live in harmony with your cat";
const textContent = `write the content structure of an ebook made for ${ebookTopic}, splitting the prompt each time you write a new section. put a @ character before each section`;
let textResponse = "";
let responseArray = [];
let finalArray = [];

async function AnswerToPrompt(textContent) {
  const dataOutput = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: textContent,
      },
    ],
  });
  let textResponse = dataOutput.choices[0].message.content;
  textResponse = dataOutput.choices[0].message.content;

  responseArray = textResponse.split("@");
  console.log(textResponse);
  console.log(responseArray);
  for (let i = 0; i < responseArray.length; i++) {
    console.log(responseArray[i]);

    const dataOutput2 = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `write a 300 word chapter on this topic: ${responseArray[i]} of an ebook talking about ${ebookTopic}`,
        },
      ],
    });

    console.log(dataOutput2.choices[0].message.content);
    finalArray.push(dataOutput2.choices[0].message.content);
  }
  console.log(finalArray);
}

AnswerToPrompt(textContent);
