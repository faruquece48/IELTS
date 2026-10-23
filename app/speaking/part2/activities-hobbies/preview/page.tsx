import CommonCuePreview from "../../CommonCuePreview";
import { activityCues } from "../activitiesData";
import { activityStories } from "../activityStories";
import "../../common-preview.css";

export default function ActivitiesPreviewPage(){return <CommonCuePreview title="Activities & Hobbies" kind="activity" backHref="/speaking/part2/activities-hobbies" cues={activityCues} stories={activityStories} color="sky"/>}
