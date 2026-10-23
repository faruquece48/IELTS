import CommonCuePreview from "../../CommonCuePreview";
import { educationTopic } from "../../remainingTopicsData";
import "../../common-preview.css";
export default function Page(){return <CommonCuePreview title={educationTopic.title} kind="education topic" backHref="/speaking/part2/education-learning" cues={educationTopic.cues} stories={educationTopic.stories} color="sky"/>}
