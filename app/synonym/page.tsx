import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Synonyms | IELTS Mastery Path",
  description: "A quick-reference collection of useful IELTS synonyms.",
};

const synonymGroups = [
  {
    word: "Nowadays",
    synonyms: ["Nowadays", "At present", "Currently", "These days", "In recent times", "Today", "In the modern era"],
  },
  {
    word: "People",
    synonyms: ["People", "Public", "Citizens", "Society", "Community", "Human beings", "Mankind", "The general public"],
  },
  {
    word: "Information",
    synonyms: ["Information", "Data", "Facts", "Knowledge", "News", "Details", "Intelligence", "Evidence"],
  },
  {
    word: "Newspapers",
    synonyms: ["Newspapers", "Press", "Daily papers", "Print media", "Broadsheets", "Periodicals", "Tabloids"],
  },
  {
    word: "Journalists",
    synonyms: ["Journalists", "Reporters", "Correspondents", "Columnists", "Editors", "News reporters", "Media professionals"],
  },
  {
    word: "Crime",
    synonyms: ["Crime", "Offence", "Illegal act", "Lawbreaking", "Criminal activity", "Felony", "Delinquency"],
  },
  {
    word: "Increase",
    synonyms: ["Increase", "Rise", "Grow", "Expand", "Escalate", "Boost", "Surge", "Climb"],
  },
  {
    word: "Problem",
    synonyms: ["Problem", "Issue", "Challenge", "Obstacle", "Difficulty", "Complication", "Hindrance"],
  },
  {
    word: "Cheap",
    synonyms: ["Cheap", "Inexpensive", "Affordable", "Economical", "Low-cost", "Budget-friendly"],
  },
  {
    word: "Dangerous",
    synonyms: ["Dangerous", "Risky", "Hazardous", "Unsafe", "Perilous", "Threatening"],
  },
  {
    word: "Study",
    synonyms: ["Study", "Research", "Investigation", "Examination", "Analysis", "Observation", "Review", "Academic work"],
  },
  {
    word: "Students",
    synonyms: ["Students", "Learners", "Pupils", "Undergraduates", "Scholars", "Trainees"],
  },
  {
    word: "Benefits",
    synonyms: ["Benefits", "Advantages", "Gains", "Profits", "Merits", "Positive outcomes", "Perks"],
  },
  {
    word: "Effective",
    synonyms: ["Effective", "Efficient", "Productive", "Successful", "Powerful", "Impactful"],
  },
  {
    word: "Crime",
    synonyms: ["Crime", "Offence", "Illegal act", "Lawbreaking", "Felony", "Criminal activity", "Delinquency"],
  },
  {
    word: "World",
    synonyms: ["World", "Earth", "Globe", "Planet", "Universe", "Global community"],
  },
  {
    word: "Method",
    synonyms: ["Method", "Technique", "Approach", "Procedure", "System", "Strategy", "Process"],
  },
  {
    word: "City",
    synonyms: ["City", "Metropolis", "Urban area", "Municipality", "Megacity", "Urban centre"],
  },
  {
    word: "Increase",
    synonyms: ["Increase", "Rise", "Grow", "Expand", "Escalate", "Boost", "Surge"],
  },
  {
    word: "Problem",
    synonyms: ["Problem", "Issue", "Difficulty", "Challenge", "Obstacle", "Complication", "Concern"],
  },
  {
    word: "Reasons",
    synonyms: ["Reasons", "Causes", "Justifications", "Motives", "Explanations", "Grounds"],
  },
  {
    word: "Solution",
    synonyms: ["Solution", "Answer", "Remedy", "Resolution", "Fix", "Approach"],
  },
  {
    word: "Food",
    synonyms: ["Food", "Nutrition", "Meals", "Diet", "Nourishment", "Edibles"],
  },
  {
    word: "Cheap",
    synonyms: ["Cheap", "Affordable", "Inexpensive", "Low-cost", "Budget-friendly", "Economical"],
  },
  {
    word: "Improved",
    synonyms: ["Improved", "Enhanced", "Developed", "Upgraded", "Advanced", "Refined"],
  },
  {
    word: "Machinery",
    synonyms: ["Machinery", "Equipment", "Devices", "Apparatus", "Instruments", "Tools"],
  },
  {
    word: "Dangerous",
    synonyms: ["Dangerous", "Risky", "Hazardous", "Unsafe", "Perilous"],
  },
  {
    word: "Health",
    synonyms: ["Health", "Wellness", "Fitness", "Well-being", "Physical condition"],
  },
  {
    word: "Agree",
    synonyms: ["Agree", "Accept", "Support", "Approve", "Consent", "Acknowledge"],
  },
  {
    word: "Disagree",
    synonyms: ["Disagree", "Oppose", "Reject", "Differ", "Object", "Contradict"],
  },
  {
    word: "Leisure",
    synonyms: ["Leisure", "Free time", "Spare time", "Relaxation", "Recreation", "Break"],
  },
  {
    word: "Industry",
    synonyms: ["Industry", "Business sector", "Manufacturing sector", "Commerce"],
  },
  {
    word: "Entertainment",
    synonyms: ["Entertainment", "Amusement", "Enjoyment", "Recreation", "Pleasure", "Fun"],
  },
  {
    word: "Technology",
    synonyms: ["Technology", "Innovation", "Electronics", "Automation", "Digital systems", "Modern technology"],
  },
  {
    word: "Modern",
    synonyms: ["Modern", "Contemporary", "Current", "Up-to-date", "Latest", "Advanced"],
  },
  {
    word: "Effect",
    synonyms: ["Effect", "Result", "Consequence", "Outcome", "Impact", "Repercussion"],
  },
  {
    word: "Individual",
    synonyms: ["Individual", "Person", "Human", "Single person", "One person"],
  },
  {
    word: "Visitors",
    synonyms: ["Visitors", "Guests", "Tourists", "Travellers", "Foreigners"],
  },
  {
    word: "Country",
    synonyms: ["Country", "Nation", "State", "Territory", "Homeland"],
  },
  {
    word: "Local",
    synonyms: ["Local", "Regional", "Native", "Community-based", "Indigenous"],
  },
  {
    word: "Customer",
    synonyms: ["Customer", "Client", "Consumer", "Buyer", "Purchaser", "Patron"],
  },
  {
    word: "Seller",
    synonyms: ["Seller", "Vendor", "Merchant", "Retailer", "Trader", "Shopkeeper"],
  },
  {
    word: "Host",
    synonyms: ["Host", "Organizer", "Presenter", "Owner", "Manager", "Entertainer"],
  },
  {
    word: "Culture",
    synonyms: ["Culture", "Civilization", "Heritage", "Traditions", "Customs", "Way of life"],
  },
  {
    word: "Opinion",
    synonyms: ["Opinion", "View", "Perspective", "Belief", "Judgement", "Standpoint"],
  },
  {
    word: "Animals",
    synonyms: ["Animals", "Creatures", "Beasts", "Wildlife", "Living organisms"],
  },
  {
    word: "Science",
    synonyms: ["Science", "Scientific study", "Knowledge system", "Research field", "Scientific discipline"],
  },
  {
    word: "Organization",
    synonyms: ["Organization", "Institution", "Company", "Association", "Structure", "Management"],
  },
  {
    word: "Secondary school",
    synonyms: ["Secondary school", "High school", "Junior high school", "Middle school"],
  },
  {
    word: "Education",
    synonyms: ["Education", "Learning", "Training", "Instruction", "Teaching", "Knowledge development"],
  },
  {
    word: "Important",
    synonyms: ["Important", "Crucial", "Significant", "Essential", "Vital", "Necessary"],
  },
  {
    number: 52,
    word: "Tradition",
    synonyms: ["Tradition", "Custom", "Heritage", "Ritual", "Cultural practice"],
  },
  {
    number: 53,
    word: "Save",
    synonyms: ["Save", "Protect", "Rescue", "Preserve", "Conserve", "Safeguard"],
  },
  {
    number: 54,
    word: "Young",
    synonyms: ["Young", "Youthful", "Juvenile", "Adolescent", "Teen"],
  },
  {
    number: 55,
    word: "Positive",
    synonyms: ["Positive", "Favorable", "Beneficial", "Optimistic", "Advantageous"],
  },
  {
    number: 56,
    word: "Negative",
    synonyms: ["Negative", "Unfavorable", "Harmful", "Detrimental", "Pessimistic"],
  },
  {
    number: 58,
    word: "Changes",
    synonyms: ["Changes", "Alterations", "Modifications", "Adjustments", "Transformations"],
  },
  {
    number: 59,
    word: "Environment",
    synonyms: ["Environment", "Surroundings", "Habitat", "Ecosystem", "Natural setting"],
  },
  {
    number: 60,
    word: "Society",
    synonyms: ["Society", "Community", "Social system", "Civilization", "Public"],
  },
  {
    number: 61,
    word: "Global",
    synonyms: ["Global", "International", "Worldwide", "Universal", "Worldwide scale"],
  },
  {
    number: 62,
    word: "Transport",
    synonyms: ["Transport", "Transportation", "Movement", "Conveyance"],
  },
  {
    number: 64,
    word: "Research",
    synonyms: ["Research", "Study", "Investigation", "Examination"],
  },
  {
    number: 65,
    word: "Old people",
    synonyms: ["Old people", "Elderly", "Senior citizens", "Aged people", "Pensioners"],
  },
  {
    number: 66,
    word: "Mobile phones",
    synonyms: ["Mobile phones", "Cell phones", "Smartphones", "Handsets", "Mobile devices"],
  },
  {
    number: 67,
    word: "Trend",
    synonyms: ["Trend", "Pattern", "Tendency", "Direction", "Movement"],
  },
  {
    number: 68,
    word: "Awareness",
    synonyms: ["Awareness", "Knowledge", "Understanding", "Consciousness", "Realization"],
  },
  {
    number: 70,
    word: "Fuel",
    synonyms: ["Fuel", "Energy source", "Combustible material", "Power source"],
  },
  {
    number: 71,
    word: "Prison",
    synonyms: ["Prison", "Jail", "Detention centre", "Correctional facility", "Penal institution"],
  },
  {
    number: 72,
    word: "Prisoner",
    synonyms: ["Prisoner", "Inmate", "Convict", "Detainee", "Offender"],
  },
  {
    number: 73,
    word: "Species",
    synonyms: ["Species", "Type", "Category", "Variety", "Class"],
  },
  {
    number: 74,
    word: "Rural areas",
    synonyms: ["Rural areas", "Countryside", "Villages", "Agricultural areas", "Remote regions"],
  },
  {
    number: 63,
    word: "Resources",
    synonyms: ["Resources", "Assets", "Materials", "Supplies", "Capital"],
  },
  {
    number: 69,
    word: "Media",
    synonyms: ["Media", "Mass media", "Communication channels", "Press", "Broadcasting"],
  },
  {
    number: 75,
    word: "Outweigh",
    synonyms: ["Outweigh", "Surpass", "Exceed", "Overbalance", "Override"],
  },
  {
    number: 75,
    word: "Farming",
    synonyms: ["Farming", "Agriculture", "Cultivation", "Crop production", "Agricultural activity"],
  },
  {
    number: 76,
    word: "Fast food",
    synonyms: ["Fast food", "Junk food", "Convenience food", "Ready-made food"],
  },
  {
    number: 77,
    word: "Extinct",
    synonyms: ["Extinct", "Vanished", "Disappeared", "Died out", "No longer existing"],
  },
  {
    number: 78,
    word: "Endangered",
    synonyms: ["Endangered", "Threatened", "At risk", "In danger of extinction"],
  },
  {
    number: 79,
    word: "Work",
    synonyms: ["Work", "Job", "Employment", "Labour", "Occupation"],
  },
  {
    number: 80,
    word: "Advertising",
    synonyms: ["Advertising", "Promotion", "Marketing", "Publicity", "Commercial promotion"],
  },
  {
    number: 81,
    word: "Future",
    synonyms: ["Future", "Upcoming", "Forthcoming", "Prospective", "Approaching"],
  },
  {
    number: 82,
    word: "Suspicious",
    synonyms: ["Suspicious", "Doubtful", "Distrustful", "Skeptical", "Questioning"],
  },
  {
    number: 83,
    word: "Government",
    synonyms: ["Government", "Administration", "Authority", "Regime", "State"],
  },
  {
    number: 84,
    word: "Internet",
    synonyms: ["Internet", "Web", "Cyberspace", "Online network"],
  },
  {
    number: 85,
    word: "Sports",
    synonyms: ["Sports", "Athletics", "Physical activities", "Games", "Exercise"],
  },
  {
    number: 86,
    word: "Television",
    synonyms: ["Television", "TV", "Small screen", "Broadcast media"],
  },
  {
    number: 87,
    word: "Architecture",
    synonyms: ["Architecture", "Building design", "Structural design", "Construction planning"],
  },
  {
    number: 88,
    word: "Immigration",
    synonyms: ["Immigration", "Migration", "Relocation", "Settlement"],
  },
  {
    number: 89,
    word: "Weapon",
    synonyms: ["Weapon", "Arms", "Firearms", "Armament"],
  },
  {
    number: 90,
    word: "Money",
    synonyms: ["Money", "Cash", "Currency", "Funds", "Capital"],
  },
  {
    number: 91,
    word: "Corporal",
    synonyms: ["Corporal", "Physical", "Bodily"],
  },
  {
    number: 92,
    word: "Punishment",
    synonyms: ["Punishment", "Penalty", "Discipline", "Sanction"],
  },
  {
    number: 93,
    word: "Behaviour",
    synonyms: ["Behaviour", "Conduct", "Attitude", "Manners"],
  },
  {
    number: 94,
    word: "Waste",
    synonyms: ["Waste", "Garbage", "Trash", "Rubbish", "Debris"],
  },
  {
    number: 95,
    word: "Pollution",
    synonyms: ["Pollution", "Contamination", "Environmental damage", "Impurity"],
  },
  {
    number: 96,
    word: "Parent",
    synonyms: ["Parent", "Guardian", "Caregiver", "Mother or father"],
  },
  {
    number: 97,
    word: "Multicultural",
    synonyms: ["Multicultural", "Multinational", "International", "Diverse"],
  },
  {
    number: 98,
    word: "Diversity",
    synonyms: ["Diversity", "Variety", "Difference", "Multiplicity"],
  },
  {
    number: 99,
    word: "Development",
    synonyms: ["Development", "Progress", "Advancement", "Growth", "Improvement"],
  },
  {
    number: 100,
    word: "Development",
    synonyms: ["Development", "Progress", "Advancement", "Growth", "Improvement", "Expansion"],
  },
  {
    number: 101,
    word: "Education system",
    synonyms: ["Education system", "Schooling system", "Academic system", "Learning framework", "Educational structure"],
  },
  {
    number: 102,
    word: "Technology advancement",
    synonyms: ["Technological advancement", "Innovation", "Digital progress", "Technological development", "Scientific advancement"],
  },
  {
    number: 103,
    word: "Urbanization",
    synonyms: ["Urbanization", "City expansion", "Metropolitan growth", "Urban development"],
  },
  {
    number: 104,
    word: "Poverty",
    synonyms: ["Poverty", "Financial hardship", "Economic deprivation", "Lack of resources", "Destitution"],
  },
  {
    number: 105,
    word: "Employment",
    synonyms: ["Employment", "Job opportunities", "Occupation", "Profession", "Work opportunities"],
  },
  {
    number: 106,
    word: "Population",
    synonyms: ["Population", "Inhabitants", "Residents", "Citizens", "People"],
  },
  {
    number: 107,
    word: "Improvement",
    synonyms: ["Improvement", "Enhancement", "Progress", "Development", "Advancement"],
  },
];

export default function SynonymPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Image
            src="/fa.png"
            alt="IELTS Logo"
            width={60}
            height={60}
            className="rounded-full"
            unoptimized
          />
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Vocabulary builder
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Useful Synonyms
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Expand your IELTS vocabulary with alternative words and phrases for common ideas.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {synonymGroups
            .map((group, index) => ({ group, index }))
            .sort(
              (a, b) =>
                (a.group.number ?? a.index + 1) -
                (b.group.number ?? b.index + 1),
            )
            .map(({ group, index }) => (
            <article
              key={`${group.word}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="border-b border-sky-200 bg-sky-50 px-5 py-4">
                <h2 className="text-lg font-bold text-slate-900">
                  <span className="mr-2 text-sky-600">{group.number ?? index + 1}.</span>
                  {group.word}
                </h2>
              </div>
              <ul className="space-y-2.5 px-5 py-5">
                {group.synonyms.map((synonym) => (
                  <li key={synonym} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>{synonym}</span>
                  </li>
                ))}
              </ul>
            </article>
            ))}
        </div>
      </section>
    </main>
  );
}
