import CommonCuePreview from "../../CommonCuePreview";
import { societyTopic } from "../../remainingTopicsData";
import "../../common-preview.css";
export default function Page(){return <CommonCuePreview title={societyTopic.title} kind="society topic" backHref="/speaking/part2/society-lifestyle" cues={societyTopic.cues} stories={societyTopic.stories} color="sky"/>}
