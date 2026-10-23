import CommonCuePreview from "../../CommonCuePreview";
import { technologyTopic } from "../../remainingTopicsData";
import "../../common-preview.css";
export default function Page(){return <CommonCuePreview title={technologyTopic.title} kind="technology topic" backHref="/speaking/part2/technology-media" cues={technologyTopic.cues} stories={technologyTopic.stories} color="violet"/>}
