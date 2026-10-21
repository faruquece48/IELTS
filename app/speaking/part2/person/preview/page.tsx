import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PrintButton from "../../places/preview/PrintButton";
import { personCues } from "../../people/personData";
import "./print.css";

const groups=[
{title:"Teacher & mentor",ids:[1,2,3,6,7,9,11,14,16,20,22,23,24,25,26,30],tone:"person-print-amber"},
{title:"Friend & colleague",ids:[4,10,13,15,19,29],tone:"person-print-sky"},
{title:"Family & community",ids:[5,12,18,21,28],tone:"person-print-rose"},
{title:"Professional leader",ids:[8,27],tone:"person-print-violet"},
{title:"Famous person",ids:[17],tone:"person-print-emerald"},
];

const stories=[
{title:"Teacher & mentor",subtitle:"A person who guided and influenced me",paragraphs:[
["Opening","I'd like to talk about a former teacher who later became an important mentor in my life. I met him during my studies and immediately noticed his calm manner, clear communication and strong sense of responsibility."],
["Character","He is patient, confident and approachable. He listens carefully, explains difficult ideas in simple language and remains respectful even when a situation becomes stressful."],
["Support","He taught me useful skills such as time management, discipline and decision-making. During difficult periods, he listened to my concerns, helped me compare my options and encouraged me to continue working toward my goals."],
["Influence","His example changed the way I think about work and responsibility. He taught me to focus on steady progress instead of quick results, and his encouragement gave me greater confidence."],
["Ending","I admire him because his advice is practical and his behaviour matches his words. He made a lasting impression on me, and his lessons are still useful in my daily life."]]},
{title:"Friend & colleague",subtitle:"A person whose company I enjoy",paragraphs:[
["Opening","I'd like to describe a close friend who is also someone I enjoy working with. We met through university life and got along well from our first conversation because he was friendly and easy to talk to."],
["Character","He has a relaxed personality and a natural sense of humour. He also communicates clearly, listens to other people's ideas and takes his responsibilities seriously."],
["Time together","We often walk, drink tea and talk about work, family and future plans. We have completed small projects together, and he always contributes useful ideas and supports the team."],
["Feeling","I feel comfortable speaking honestly with him because he does not judge people quickly. He can make me laugh after a tiring day and can also have a serious conversation when I need advice."],
["Ending","I value this friendship because it combines trust, humour and mutual respect. Whether we are working or spending free time together, his company makes the experience better."]]},
{title:"Family & community",subtitle:"A caring person who is always present",paragraphs:[
["Opening","I'd like to talk about my mother, who is one of the most important people in my daily life. I have always been close to her and speak with her regularly even when work keeps me busy."],
["Character","She is calm, caring and practical. She also has a creative side and enjoys trying new recipes, arranging the home and finding simple solutions to everyday problems."],
["Support","She supports our family without seeking attention and often helps neighbours who need advice or practical assistance. People trust her because she listens patiently and treats everyone with respect."],
["Feeling","Her presence gives me a sense of stability. I can discuss personal worries with her, and her simple advice often helps me understand a problem and make a sensible decision."],
["Ending","I value her because of the way she treats both family members and neighbours. Her kindness, creativity and quiet support make her a strong example in my life."]]},
{title:"Professional leader",subtitle:"A skilled person who manages others well",paragraphs:[
["Opening","I'd like to describe a senior colleague at my university who is very good at his job and manages people effectively. I have watched him handle academic and administrative work in many situations."],
["Character","He is organised, calm and confident without being unfriendly. He explains expectations clearly, listens to team members and considers the available information before making a decision."],
["Work","When a problem occurs, he does not blame people. He identifies the cause, divides the work fairly and helps the team find a practical solution."],
["Influence","I learned from him that good management depends on communication and trust, not only authority. People cooperate because they feel respected and understand their responsibilities."],
["Ending","He combines professional skill with a people-first approach. His calm leadership produces consistent results and creates a healthier working environment."]]},
{title:"Famous person",subtitle:"A public figure whose work I admire",paragraphs:[
["Opening","I'd like to talk about Professor Muhammad Yunus, a well-known Bangladeshi social entrepreneur and Nobel laureate. I learned about him through books, news and discussions about development."],
["Work","He is known for developing microcredit, which offers small loans to people who may not have access to traditional banks. It helps low-income people start small businesses."],
["Qualities","I admire his ability to connect a simple financial idea with a serious social problem. His work required vision, patience and confidence."],
["Impact","His work received global recognition and influenced discussions about poverty, finance and social business. It showed that a local idea can create a wider impact."],
["Ending","I admire him because he used knowledge to address a real problem. His career is a strong example of purpose-driven work and social responsibility."]]},
] as const;

export default function PersonPreviewPage(){return <main className="min-h-screen bg-slate-100 text-slate-900">
<header className="person-toolbar sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-2"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized/></Link><Navbar/></div></header>
<div className="person-toolbar mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-5 py-5"><div><Link href="/speaking/part2/person" className="text-sm font-bold text-emerald-700">← Back to the 30 cards</Link><p className="mt-1 text-sm text-slate-500">One PDF with two A4 landscape pages: vocabulary route and five reusable stories.</p></div><PrintButton/></div>
<div className="person-print-wrap mx-auto max-w-[1500px] px-5 pb-8"><section className="person-sheet mx-auto overflow-hidden rounded-2xl border border-slate-300 bg-[#fffef9] p-5 shadow-xl"><div className="text-center"><h1 className="text-2xl font-black text-emerald-950">Person Vocabulary & Phrase Memory Route</h1><p className="mt-1 text-xs font-semibold text-slate-500">Thirty cue cards grouped into five reusable stories</p></div><div className="person-columns mt-4 grid gap-2.5">{groups.map(group=><section key={group.title} className={`person-column rounded-xl border p-3 ${group.tone}`}><h2 className="border-b border-current/15 pb-2 text-xs font-black uppercase tracking-wider">{group.title}</h2>{group.ids.map(id=>{const cue=personCues.find(item=>item.id===id)!;return <article key={id} className="person-topic mt-2 border-t border-slate-900/10 pt-2 first:border-0 first:pt-0"><h3 className="text-[10px] font-black leading-tight text-emerald-950">#{id} · {cue.question}</h3><ol className="mt-1">{cue.vocabulary.map((phrase,index)=><li key={phrase} className="mt-0.5 text-[8px] font-semibold leading-tight text-slate-700"><span className="mr-1 text-emerald-700">{index+1}.</span>{phrase}</li>)}</ol></article>})}</section>)}</div></section>
<section className="person-story-sheet mx-auto mt-8 flex flex-col overflow-hidden rounded-2xl border border-slate-300 bg-[#fffef9] p-5 shadow-xl"><div className="person-story-grid grid flex-1 gap-3">{stories.map((story,index)=><article key={story.title} className="person-story rounded-xl border border-emerald-200 bg-emerald-50/60 p-4"><div className="flex gap-2"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-800 text-xs font-black text-white">{index+1}</span><div><h2 className="text-sm font-black text-emerald-950">{story.title}</h2><p className="text-[11px] font-bold text-emerald-700">{story.subtitle}</p></div></div><div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700">{story.paragraphs.map(([label,text])=><p key={label}><strong className="text-emerald-900">{label}:</strong> {text}</p>)}</div></article>)}</div></section></div>
</main>}
