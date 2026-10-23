import CommonCuePreview from "../../CommonCuePreview";
import { workTopic } from "../../remainingTopicsData";
import "../../common-preview.css";
export default function Page(){return <CommonCuePreview title={workTopic.title} kind="work topic" backHref="/speaking/part2/work-business" cues={workTopic.cues} stories={workTopic.stories} color="violet"/>}
