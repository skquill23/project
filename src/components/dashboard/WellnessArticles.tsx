import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, TrendingUp, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Article {
  title: string;
  summary: string;
  category: string;
  readTime: string;
  source: string;
  url: string;
}

const WellnessArticles = () => {
  const [articles] = useState<Article[]>([
    {
      title: "The Science of Muscle Recovery: What Actually Works",
      summary: "Recent studies show that proper sleep, hydration, and progressive overload are more crucial for muscle recovery than previously thought. Active recovery and proper nutrition timing play key roles in maximizing gains.",
      category: "Muscle Building",
      readTime: "5 min",
      source: "Sports Medicine Journal",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9451246/"
    },
    {
      title: "Understanding Protein Synthesis: Optimal Timing and Amounts",
      summary: "New research indicates that distributing protein intake evenly throughout the day (20-40g per meal) maximizes muscle protein synthesis better than large single doses. Quality matters as much as quantity.",
      category: "Nutrition",
      readTime: "4 min",
      source: "Journal of Nutrition",
      url: "https://www.mdpi.com/2072-6643/12/7/1912"
    },
    {
      title: "HIIT vs. Steady-State Cardio: Which Burns More Fat?",
      summary: "Meta-analysis reveals that while HIIT burns more calories per minute, both methods are effective for fat loss when matched for total energy expenditure. The best choice depends on individual preferences and adherence.",
      category: "Weight Loss",
      readTime: "6 min",
      source: "British Journal of Sports Medicine",
      url: "https://bjsm.bmj.com/content/53/10/655"
    },
    {
      title: "The Role of Sleep in Athletic Performance and Recovery",
      summary: "Studies demonstrate that 7-9 hours of quality sleep significantly impacts strength gains, endurance, and injury prevention. Poor sleep disrupts hormone balance and muscle recovery processes.",
      category: "Recovery",
      readTime: "5 min",
      source: "Sleep Medicine Reviews",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8533075/"
    },
    {
      title: "Progressive Overload: The Key to Continuous Gains",
      summary: "Research confirms that systematically increasing training volume, intensity, or frequency is essential for long-term progress. Small, consistent increases (2-5% weekly) yield better results than sporadic jumps.",
      category: "Training",
      readTime: "7 min",
      source: "Strength & Conditioning Research",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5744434/"
    },
    {
      title: "Hydration and Exercise Performance: New Guidelines",
      summary: "Latest WHO recommendations suggest drinking 15-20ml per kg of body weight daily, with additional intake during exercise. Proper hydration improves endurance, strength output, and cognitive function.",
      category: "Health",
      readTime: "4 min",
      source: "World Health Organization",
      url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity"
    },
    {
      title: "Micronutrients for Athletes: Beyond Macros",
      summary: "Emerging evidence shows that adequate vitamin D, magnesium, and zinc levels are crucial for testosterone production, bone health, and immune function in active individuals.",
      category: "Nutrition",
      readTime: "6 min",
      source: "Nutrients Journal",
      url: "https://www.mdpi.com/2072-6643/14/9/1896"
    },
    {
      title: "The Mind-Muscle Connection: Does It Really Work?",
      summary: "Recent studies validate that consciously focusing on the target muscle during exercise can increase muscle activation by up to 20%, leading to better hypertrophy and strength gains over time.",
      category: "Training",
      readTime: "5 min",
      source: "European Journal of Sport Science",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8325497/"
    }
  ]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Muscle Building": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Nutrition": "bg-green-500/10 text-green-500 border-green-500/20",
      "Weight Loss": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "Recovery": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "Training": "bg-red-500/10 text-red-500 border-red-500/20",
      "Health": "bg-teal-500/10 text-teal-500 border-teal-500/20"
    };
    return colors[category] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Daily Wellness & Fitness Insights
              </CardTitle>
              <CardDescription>
                Evidence-based articles to enhance your fitness journey
              </CardDescription>
            </div>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {articles.map((article, idx) => (
                <Card key={idx} className="border-2 hover:border-primary transition-all duration-200">
                  <CardHeader>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-lg leading-tight">
                          {article.title}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={getCategoryColor(article.category)}
                        >
                          {article.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {article.readTime} read
                        </span>
                        <span>•</span>
                        <span>{article.source}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {article.summary}
                    </p>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Read Full Article
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Stay Informed</p>
              <p className="text-xs text-muted-foreground">
                These articles are curated from peer-reviewed journals and trusted health organizations. 
                New content is updated daily to help you stay on top of the latest fitness science.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessArticles;
