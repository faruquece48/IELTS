type StorySource = {
  question: string;
  notes: string[];
  vocabulary: string[];
  memory: string;
};

function list(items: string[]) {
  if (items.length < 2) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function lowerFirst(text: string) {
  return text ? text[0].toLowerCase() + text.slice(1) : text;
}

export function personCardStory(card: StorySource & { person: string }) {
  return [
    ["Opening", `I'd like to talk about ${card.person}, who is the person I immediately associate with this topic.`],
    ["Context", card.memory],
    ["Details", `The main details I would develop are ${list(card.notes.map(lowerFirst))}. Together, they explain the situation clearly and keep the answer focused on the cue card.`],
    ["Reflection", `Overall, this person stands out to me because the experience involved ${list(card.vocabulary.slice(0, 3).map(lowerFirst))}. That is why this is the example I would choose.`],
  ] as const;
}

export function placeCardStory(card: StorySource & { place: string }) {
  return [
    ["Opening", `I'd like to describe ${card.place}, which is the place I immediately think of for this topic.`],
    ["Context", card.memory],
    ["Details", `To develop the answer, I would mention ${list(card.notes.map(lowerFirst))}. These details show what I did there and why the place was relevant.`],
    ["Reflection", `Overall, I remember it for its ${list(card.vocabulary.slice(0, 3).map(lowerFirst))}. For those reasons, it remains a meaningful place to describe.`],
  ] as const;
}

export function eventCardStory(card: StorySource & { event: string }) {
  return [
    ["Opening", `I'd like to describe ${lowerFirst(card.event)}, which is the event I immediately think of for this topic.`],
    ["Context", card.memory],
    ["Development", `The key details were ${list(card.notes.map(lowerFirst))}. I would explain them in this order so the listener can follow what happened and understand my reaction.`],
    ["Reflection", `Looking back, the experience involved ${list(card.vocabulary.slice(0, 3).map(lowerFirst))}. That is why it stayed in my memory and fits this cue card well.`],
  ] as const;
}

export function objectCardStory(card: Pick<StorySource, "question" | "notes" | "vocabulary"> & { subject: string }) {
  return [
    ["Opening", `I'd like to describe my ${lowerFirst(card.subject)}, which is the object I immediately associate with this topic.`],
    ["Background", `It became relevant to me because ${lowerFirst(card.notes[0] ?? "it plays a useful role in my everyday life")}.`],
    ["Details", `The main points I would explain are ${list(card.notes.slice(1).map(lowerFirst))}. These details connect the object directly to the cue card.`],
    ["Reflection", `Overall, I value it for its ${list(card.vocabulary.slice(0, 3).map(lowerFirst))}. That is why it is a natural and memorable example for me.`],
  ] as const;
}
