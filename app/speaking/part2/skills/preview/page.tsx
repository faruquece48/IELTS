import CommonCuePreview from "../../CommonCuePreview";
import { skillCues } from "../skillsData";
import { skillStories } from "../skillStories";
import "../../common-preview.css";

export default function SkillsPreviewPage(){return <CommonCuePreview title="Skills" kind="skill" backHref="/speaking/part2/skills" cues={skillCues} stories={skillStories} color="violet"/>}
