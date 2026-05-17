import Link from "next/link";
import { TestConfig } from "@/lib/types";

const categoryColors: Record<TestConfig["category"], string> = {
  mood: "bg-purple-50 text-purple-700 border-purple-200",
  anxiety: "bg-blue-50 text-blue-700 border-blue-200",
  work: "bg-orange-50 text-orange-700 border-orange-200",
  stress: "bg-green-50 text-green-700 border-green-200",
  ocd: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const categoryLabel: Record<TestConfig["category"], string> = {
  mood: "المزاج",
  anxiety: "القلق",
  work: "العمل",
  stress: "التوتر",
  ocd: "الوسواس",
};

export function TestCard({ config }: { config: TestConfig }) {
  return (
    <Link href={`/${config.slug}`}>
      <div className="group bg-card border border-border rounded-2xl p-6 hover:border-sage-300 hover:shadow-md transition-all duration-200 flex flex-col gap-4 h-full cursor-pointer">
        <div className="flex justify-between items-start">
          <span className="text-4xl">{config.icon}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full border font-medium ${categoryColors[config.category]}`}
          >
            {categoryLabel[config.category]}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-foreground group-hover:text-sage-600 transition-colors">
            {config.name}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {config.shortDescription}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
          <span>⏱ {config.estimatedMinutes} دقائق</span>
          <span>📋 {config.questions.length} أسئلة</span>
        </div>
      </div>
    </Link>
  );
}
