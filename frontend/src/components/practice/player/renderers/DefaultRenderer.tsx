import { QuestionText } from "./renderer-utils";

export default function DefaultRenderer({ text }: { text: string }) {
  return <QuestionText text={text} />;
}