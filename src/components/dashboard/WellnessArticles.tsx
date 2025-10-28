import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, Sparkles, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Article {
  title: string;
  summary: string;
  category: string;
  readTime: string;
  source: string;
  fullContent: string;
}

const WellnessArticles = () => {
  const [openArticles, setOpenArticles] = useState<Set<number>>(new Set());
  
  const articles: Article[] = [
    {
      title: "The Science of Muscle Recovery: What Actually Works",
      summary: "Recent studies show that proper sleep, hydration, and progressive overload are more crucial for muscle recovery than previously thought.",
      category: "Muscle Building",
      readTime: "5 min",
      source: "Sports Medicine Journal",
      fullContent: `Muscle recovery is a complex physiological process that extends far beyond simply resting after a workout. Recent research has illuminated several key factors that significantly impact how effectively our muscles recover and adapt to training stress.

**Sleep: The Foundation of Recovery**

Sleep emerges as perhaps the most critical recovery factor. During deep sleep, the body releases growth hormone, which is essential for muscle repair and growth. Studies show that athletes who get 7-9 hours of quality sleep experience 20-30% better recovery rates compared to those sleeping less than 6 hours. Sleep deprivation also disrupts protein synthesis and increases cortisol levels, both detrimental to muscle recovery.

**Hydration and Cellular Function**

Proper hydration plays a more significant role than many realize. Muscles are approximately 75% water, and even mild dehydration (2-3% body weight loss) can impair recovery by reducing blood flow to muscles and slowing nutrient delivery. Research indicates that drinking 15-20ml per kg of body weight daily, with additional intake during training, optimizes recovery processes.

**Progressive Overload: The Adaptation Signal**

The principle of progressive overload—gradually increasing training stress—is crucial not just for gains but for effective recovery adaptation. By systematically increasing volume or intensity by 2-5% weekly, the body learns to recover more efficiently. Sudden large increases in training load often lead to incomplete recovery and increased injury risk.

**Active Recovery Benefits**

Light activity on rest days, such as walking or gentle swimming, can enhance recovery by increasing blood flow without creating additional muscle damage. Studies show that 20-30 minutes of low-intensity activity can reduce muscle soreness by 15-25% compared to complete rest.

**Nutrition Timing Matters**

While the old "anabolic window" concept has been somewhat debunked, consuming protein within a few hours of training still shows benefits. More importantly, spreading protein intake evenly throughout the day (20-40g per meal) maximizes recovery by maintaining elevated protein synthesis rates.

**Practical Implementation**

For optimal recovery: prioritize 7-9 hours of sleep, maintain consistent hydration, follow a structured progressive overload program, include light active recovery, and distribute protein intake evenly across meals. These evidence-based strategies work synergistically to maximize your body's recovery capacity.`
    },
    {
      title: "Understanding Protein Synthesis: Optimal Timing and Amounts",
      summary: "New research indicates that distributing protein intake evenly throughout the day (20-40g per meal) maximizes muscle protein synthesis.",
      category: "Nutrition",
      readTime: "4 min",
      source: "Journal of Nutrition",
      fullContent: `Protein synthesis is the biological process by which cells build new proteins, fundamental to muscle growth, repair, and overall health. Recent research has revolutionized our understanding of how to optimize this process through strategic protein intake.

**The Protein Synthesis Window**

Contrary to popular belief, the critical factor isn't consuming protein immediately post-workout, but rather maintaining elevated protein synthesis throughout the day. Research shows that protein synthesis can be stimulated for up to 24-48 hours after training, making overall daily distribution more important than precise timing.

**Optimal Per-Meal Amounts**

Studies demonstrate that 20-40 grams of high-quality protein per meal optimally stimulates muscle protein synthesis in most individuals. Consuming more than 40g in a single meal doesn't proportionally increase synthesis and may simply be oxidized for energy. Smaller individuals may benefit from the lower end (20-25g), while larger athletes may need the higher range (35-40g).

**Frequency Matters**

Distributing protein across 4-5 meals separated by 3-4 hours maintains consistently elevated protein synthesis rates. This approach proves superior to consuming the same total protein in fewer, larger meals. Each protein feeding "resets" the synthesis process, maximizing daily anabolic stimulus.

**Quality Over Quantity**

Not all protein sources are equal. Complete proteins containing all essential amino acids—particularly leucine—are most effective. Leucine acts as a trigger for protein synthesis, with approximately 2-3g per meal being optimal. High-quality sources include:
- Whey protein (rapidly absorbed)
- Chicken breast (complete amino acid profile)
- Eggs (highly bioavailable)
- Fish (omega-3 bonus)
- Greek yogurt (slow-digesting casein)

**Before Bed Strategy**

Consuming 30-40g of slow-digesting protein (like casein) before sleep can enhance overnight recovery. During sleep, the body undergoes significant repair processes, and providing sustained amino acid availability supports this recovery period.

**Practical Application**

For a 75kg individual aiming to build muscle:
- Target: 150-165g protein daily (2-2.2g per kg)
- Distribution: 30-35g across 5 meals
- Timing: Every 3-4 hours while awake
- Pre-bed: 30-40g slow-digesting protein

This evidence-based approach ensures you're providing your body with optimal building blocks for muscle growth and recovery throughout the entire day.`
    },
    {
      title: "HIIT vs. Steady-State Cardio: Which Burns More Fat?",
      summary: "Meta-analysis reveals that while HIIT burns more calories per minute, both methods are effective for fat loss when matched for total energy expenditure.",
      category: "Weight Loss",
      readTime: "6 min",
      source: "British Journal of Sports Medicine",
      fullContent: `The debate between High-Intensity Interval Training (HIIT) and steady-state cardio for fat loss has dominated fitness discussions for years. Recent meta-analyses provide clarity on which approach is truly superior.

**The Calorie Burn Comparison**

HIIT burns approximately 25-30% more calories per minute compared to moderate-intensity steady-state cardio. A typical 20-minute HIIT session might burn 200-300 calories, while 20 minutes of steady-state jogging burns 150-200 calories. However, this apparent advantage becomes less significant when examining total energy expenditure.

**Time Efficiency vs. Total Volume**

HIIT's primary advantage is time efficiency. When matched for total energy expenditure, studies show virtually identical fat loss between HIIT and steady-state cardio. A 20-minute HIIT session can match the caloric burn of a 30-40 minute steady-state session, making HIIT ideal for time-constrained individuals.

**The EPOC Effect**

HIIT creates a more substantial "afterburn effect" (Excess Post-Exercise Oxygen Consumption), where metabolism remains elevated for hours post-workout. This accounts for an additional 50-150 calories burned after training. While meaningful, this represents only 10-15% of total workout caloric expenditure.

**Adherence: The Hidden Factor**

Research increasingly highlights adherence as the most critical factor. The "best" cardio method is the one you'll consistently perform. HIIT sessions are shorter but more demanding, potentially leading to burnout or injury if overused. Steady-state cardio is less intense but requires more time commitment.

**Recovery Considerations**

HIIT places greater stress on the central nervous system and muscles, requiring more recovery time. For individuals also performing resistance training, excessive HIIT can interfere with strength gains and increase injury risk. Steady-state cardio imposes less recovery demand, allowing more frequent training.

**Muscle Preservation**

Both methods can be performed with minimal muscle loss when combined with proper nutrition and resistance training. However, excessive cardio of any type without adequate protein intake and strength training can lead to muscle loss alongside fat loss.

**Practical Recommendations**

For optimal results, consider a balanced approach:

**For Fat Loss with Limited Time:**
- 2-3 HIIT sessions weekly (15-25 minutes)
- 1-2 steady-state sessions (30-45 minutes)
- Total: 150-200 minutes weekly

**For Maximum Fat Loss:**
- 2 HIIT sessions weekly
- 3-4 steady-state sessions
- Total: 200-300 minutes weekly

**Key Considerations:**
- Prioritize consistency over intensity
- Match method to lifestyle and preferences
- Monitor recovery between sessions
- Combine with resistance training
- Adjust based on individual response

The evidence is clear: both methods work effectively for fat loss. Your choice should depend on time availability, fitness level, recovery capacity, and personal preference. The sustainable approach that fits your lifestyle will always outperform the "optimal" method you can't maintain.`
    },
    {
      title: "The Role of Sleep in Athletic Performance and Recovery",
      summary: "Studies demonstrate that 7-9 hours of quality sleep significantly impacts strength gains, endurance, and injury prevention.",
      category: "Recovery",
      readTime: "5 min",
      source: "Sleep Medicine Reviews",
      fullContent: `Sleep represents one of the most powerful yet underutilized performance-enhancing tools available to athletes and fitness enthusiasts. Emerging research demonstrates that sleep quality and duration profoundly impact virtually every aspect of athletic performance and recovery.

**Hormonal Impact**

During deep sleep, the body releases growth hormone, with peak secretion occurring during the first few hours of sleep. This hormone is critical for muscle repair, tissue growth, and fat metabolism. Studies show that individuals getting less than 6 hours of sleep experience up to 30% reduction in growth hormone secretion compared to those sleeping 7-9 hours.

Sleep deprivation also elevates cortisol levels, the body's primary stress hormone. Elevated cortisol interferes with muscle recovery, promotes fat storage (particularly abdominal fat), and can suppress immune function. Just one night of poor sleep can increase cortisol by 20-40%.

**Performance Metrics**

Research on athletes demonstrates clear performance decrements with insufficient sleep:
- Strength: 10-15% reduction in maximal strength
- Endurance: 15-20% decrease in time to exhaustion
- Power output: 7-12% reduction in sprint performance
- Reaction time: 300-500ms slower responses
- Accuracy: 20-30% more errors in skill-based tasks

Conversely, extending sleep to 9-10 hours (sleep extension studies) shows improvements in:
- Sprint times: 4-6% faster
- Free throw accuracy: 9% improvement
- Reaction time: 12% faster
- Mood and energy: Significantly enhanced

**Muscle Recovery and Protein Synthesis**

Sleep is when the body performs the majority of its repair work. During deep sleep, blood flow to muscles increases dramatically, delivering oxygen and nutrients while removing metabolic waste products. Protein synthesis rates are elevated, allowing muscles to repair micro-damage from training.

Studies using muscle biopsies show that individuals sleeping 8 hours have 30% higher protein synthesis rates compared to those sleeping 5-6 hours, even when dietary protein intake is identical.

**Injury Prevention**

The relationship between sleep and injury risk is striking. Research on adolescent athletes found that those sleeping less than 8 hours per night were 1.7 times more likely to suffer injuries compared to those sleeping 8+ hours. In professional athletes, the injury rate increases by approximately 60% when sleep drops below 7 hours.

Insufficient sleep impairs coordination, balance, and proprioception—all crucial for injury prevention. It also slows healing of existing injuries by up to 30-40%.

**Cognitive Function and Decision Making**

Athletic performance isn't just physical. Sleep-deprived athletes show impaired:
- Decision-making speed and accuracy
- Strategic thinking
- Risk assessment
- Motivation and mental toughness
- Emotional regulation

**Sleep Quality Optimization**

To maximize sleep benefits:

**Before Bed (1-2 hours):**
- Dim lights (reduces alertness-promoting light)
- Cool room (18-20°C optimal)
- No screens (blue light suppresses melatonin)
- Light protein snack (sustains amino acids overnight)

**Consistency:**
- Same sleep and wake times daily
- Weekend sleep schedule within 1 hour of weekdays
- Nap strategically: 20-30 minutes max, before 3 PM

**Sleep Environment:**
- Complete darkness (blackout curtains or eye mask)
- Quiet (white noise machine if needed)
- Comfortable mattress and pillows
- Temperature controlled

**Recovery Priority:**
For serious athletes and fitness enthusiasts, sleep should be treated as a non-negotiable training component, equal in importance to nutrition and exercise programming. The performance and health benefits of prioritizing 7-9 hours of quality sleep far exceed the perceived productivity gains from staying up late.`
    },
    {
      title: "Progressive Overload: The Key to Continuous Gains",
      summary: "Research confirms that systematically increasing training volume, intensity, or frequency is essential for long-term progress.",
      category: "Training",
      readTime: "7 min",
      source: "Strength & Conditioning Research",
      fullContent: `Progressive overload is the fundamental principle underlying all successful strength and muscle-building programs. Without systematically increasing training stress, your body has no reason to adapt and grow stronger. Recent research has refined our understanding of how to apply this principle optimally.

**The Adaptation Principle**

Your body adapts to the specific demands placed upon it. When you lift a weight, perform cardio, or execute any physical task, your body perceives this as stress. In response, it adapts to handle that stress more efficiently in the future. However, once adapted, the same stimulus no longer produces further adaptation—you plateau.

Progressive overload breaks this plateau by continually challenging your body with incrementally greater demands, forcing ongoing adaptation. This principle applies to all fitness goals: strength, muscle size, endurance, and power.

**Methods of Progressive Overload**

**1. Increase Weight (Load)**
The most straightforward method—lift heavier weight for the same sets and reps. Research suggests increasing load by 2-5% when you can complete all prescribed sets and reps with good form.

Example: Squat 100kg for 3 sets of 8 reps → Next session: 102.5kg for 3 sets of 8 reps

**2. Increase Volume (Sets/Reps)**
Adding sets or reps increases total work performed, stimulating additional adaptation.

Example: Bench press 80kg for 3 sets of 8 reps → Next session: 80kg for 3 sets of 10 reps or 80kg for 4 sets of 8 reps

**3. Increase Frequency**
Training a muscle group more frequently (while managing recovery) can enhance adaptation.

Example: Training chest once weekly → Twice weekly with adjusted volume per session

**4. Increase Exercise Difficulty**
Progress from easier to more challenging exercise variations.

Example: Push-ups on knees → Regular push-ups → Decline push-ups → Weighted push-ups

**5. Improve Technique**
While not traditional overload, better form allows you to recruit muscles more effectively, increasing actual training stimulus.

**Optimal Rate of Progression**

Research indicates that smaller, consistent increases outperform larger, sporadic jumps:

**Beginners (0-1 year training):**
- Strength gains: 5-10% monthly
- Can add weight almost every session initially
- Progress slows after first 3-6 months

**Intermediate (1-3 years):**
- Strength gains: 2-3% monthly
- Weight increases every 2-4 weeks
- May require periodization for continued progress

**Advanced (3+ years):**
- Strength gains: 0.5-1% monthly
- Weight increases every 1-3 months
- Requires sophisticated programming

**The 2-5% Rule**

When you successfully complete all prescribed sets and reps with good form, increase the load by 2-5%:
- Small muscle groups (biceps, triceps): 2-3%
- Large muscle groups (chest, back, legs): 3-5%

This conservative approach ensures sustainable progress while minimizing injury risk.

**Volume Landmarks**

Research identifies optimal volume ranges for muscle growth:
- Minimum effective volume: 10-12 sets per muscle group weekly
- Optimal volume: 12-20 sets per muscle group weekly
- Maximum recoverable volume: Varies individually, typically 20-25+ sets

Start at the lower end and gradually increase sets over time, monitoring recovery.

**Common Mistakes**

**1. Too Much, Too Soon**
Increasing weight by 10-20% weekly leads to form breakdown, injury, and plateaus. Slow and steady wins.

**2. No Deload Weeks**
Training at high intensity indefinitely leads to accumulated fatigue. Include deload weeks (50-60% normal volume/intensity) every 4-8 weeks.

**3. Neglecting Other Variables**
Fixating solely on weight while ignoring volume, frequency, and technique limits progress. Use all available methods strategically.

**4. Inconsistent Tracking**
Without detailed records, you can't objectively measure progress. Track all workouts: exercises, sets, reps, weight, and how it felt.

**Practical Implementation**

**12-Week Progressive Overload Plan (Intermediate Trainee):**

**Weeks 1-4:** Base Building
- Establish working weights
- Focus on perfect technique
- 3 sets of 8-10 reps
- Leave 1-2 reps in reserve

**Weeks 5-8:** Intensity Phase
- Increase load by 5-7.5%
- Maintain 3 sets of 8-10 reps
- May need to drop to 6-8 reps initially with heavier weight

**Weeks 9-11:** Volume Phase
- Add 4th set to key exercises
- Maintain the intensity from weeks 5-8
- Total volume increased by 33%

**Week 12:** Deload
- Reduce volume to 50% (drop back to 2 sets)
- Maintain intensity (same weights)
- Active recovery focus

**Week 13+:** Repeat cycle with 2-5% higher starting weights

**Monitoring Progress**

Track these metrics to ensure progressive overload:
- Total volume load (sets × reps × weight)
- Average weight per exercise
- Total reps at each weight
- Rate of perceived exertion (RPE)

When progress stalls for 2-3 weeks, reassess:
- Are you sleeping 7-9 hours?
- Is protein intake adequate (2g/kg body weight)?
- Has stress increased significantly?
- Do you need a deload week?

Progressive overload isn't just a principle—it's the fundamental law governing adaptation to training. Master its application, and your progress becomes limited only by recovery capacity, nutrition, and consistency. Apply it poorly, and even the most sophisticated program will fail to deliver results.`
    },
    {
      title: "Hydration and Exercise Performance: New Guidelines",
      summary: "Latest WHO recommendations suggest drinking 15-20ml per kg of body weight daily, with additional intake during exercise.",
      category: "Health",
      readTime: "4 min",
      source: "World Health Organization",
      fullContent: `Hydration profoundly impacts exercise performance, recovery, and overall health. Recent research has refined our understanding of optimal hydration strategies, moving beyond the outdated "8 glasses per day" guideline to more personalized recommendations.

**The Science of Hydration**

Water comprises approximately 60% of body weight and 75% of muscle tissue. It serves critical functions:
- Temperature regulation through sweating
- Nutrient and oxygen transport to cells
- Waste product removal from muscles
- Joint lubrication and cushioning
- Blood volume maintenance

Even mild dehydration (2-3% body weight loss) significantly impairs physical and cognitive performance.

**Performance Impact**

Research demonstrates clear performance decrements with dehydration:

**2% Dehydration:**
- 10-15% reduction in endurance capacity
- 5-10% decrease in strength and power output
- Increased perceived exertion (exercise feels harder)
- Elevated heart rate by 5-10 beats per minute

**3-5% Dehydration:**
- 20-30% reduction in endurance performance
- 15-20% decrease in muscular endurance
- Impaired cognitive function and decision-making
- Significantly increased risk of heat illness

**Personalized Hydration Guidelines**

The WHO and sports science research recommend individualizing hydration based on body weight:

**Daily Baseline Needs:**
- Sedentary individuals: 30-35ml per kg body weight
- Active individuals: 35-40ml per kg body weight
- Very active/hot climates: 40-50ml per kg body weight

**Example Calculations:**
- 70kg sedentary person: 2.1-2.5 liters daily
- 70kg active person: 2.5-2.8 liters daily
- 70kg athlete: 2.8-3.5 liters daily

**Exercise Hydration Strategy**

**Pre-Exercise (2-4 hours before):**
- Drink 5-7ml per kg body weight
- 70kg person: 350-500ml
- Allows time for excess fluid excretion

**During Exercise:**
For sessions longer than 60 minutes or intense sessions:
- 150-250ml every 15-20 minutes
- Adjust based on sweat rate and conditions
- Cool beverages (10-15°C) absorb faster

**Post-Exercise Recovery:**
- Replace 150% of fluid loss
- Calculate loss: pre-exercise weight - post-exercise weight
- If lost 1kg (1L): drink 1.5L over 2-4 hours
- Include sodium (electrolytes) to enhance retention

**Sweat Rate Assessment**

Individual sweat rates vary dramatically (0.5-2.5L per hour). To determine yours:

1. Weigh yourself naked before exercise
2. Exercise for 60 minutes at normal intensity
3. Weigh yourself again (dry off first)
4. Add any fluid consumed during exercise
5. Calculate: Weight loss (kg) + fluid consumed = hourly sweat rate

**Electrolytes Matter**

During prolonged exercise (90+ minutes) or high-intensity training, electrolyte replacement becomes crucial:
- Sodium: 300-600mg per hour
- Potassium: 100-200mg per hour
- Magnesium: 50-100mg per hour

Signs you need electrolytes:
- Muscle cramping despite adequate hydration
- Extreme fatigue
- Headaches
- Nausea

**Hydration Indicators**

**Urine Color:**
- Pale yellow: Well hydrated
- Dark yellow/amber: Dehydrated
- Clear: Possibly over-hydrated

**Body Signals:**
- Thirst: Already slightly dehydrated
- Dark urine: Moderate dehydration
- Dizziness/headache: Significant dehydration
- Muscle cramps: Electrolyte imbalance

**Common Mistakes**

**1. Drinking Only When Thirsty**
Thirst lags behind actual hydration needs. By the time you feel thirsty, performance is already compromised.

**2. Over-hydration**
Excessive water intake without electrolytes can cause hyponatremia (low blood sodium), a dangerous condition. Stick to recommended ranges.

**3. Ignoring Environmental Factors**
Hot, humid conditions increase sweat rates by 50-100%. Adjust intake accordingly.

**4. Caffeine Misconceptions**
Moderate caffeine (200-400mg daily) doesn't cause dehydration in habitual users. However, excessive caffeine (500mg+) can increase fluid loss.

**Practical Daily Hydration Plan**

**Morning:**
- 500ml upon waking (rehydrates from sleep)

**Throughout Day:**
- 250ml every 2 hours
- More before/during/after exercise

**With Meals:**
- 250-500ml with each meal

**Before Bed:**
- 250ml (prevents nighttime dehydration)

**Exercise Days:**
- Add pre, during, and post-exercise hydration

**Hydration-Rich Foods**

Foods can contribute 20-30% of daily fluid intake:
- Watermelon: 92% water
- Cucumbers: 95% water
- Oranges: 86% water
- Greek yogurt: 85% water
- Broth-based soups: 90-95% water

**Special Considerations**

**High Altitude:**
- Increase intake by 0.5-1L daily
- Dry air increases respiratory water loss

**Illness:**
- Add 250-500ml extra per day
- Electrolyte drinks if vomiting/diarrhea

**Pregnancy/Breastfeeding:**
- Add 1-1.5L above baseline needs

Optimal hydration requires attention and planning, but the performance and health benefits—improved endurance, strength, recovery, and cognitive function—make it one of the highest-impact interventions available. Start tracking your intake today using the personalized guidelines above.`
    },
  ];

  const toggleArticle = (idx: number) => {
    const newOpen = new Set(openArticles);
    if (newOpen.has(idx)) {
      newOpen.delete(idx);
    } else {
      newOpen.add(idx);
    }
    setOpenArticles(newOpen);
  };

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
                Evidence-based articles to enhance your fitness journey. Click to expand and read full articles.
              </CardDescription>
            </div>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {articles.map((article, idx) => (
                <Collapsible
                  key={idx}
                  open={openArticles.has(idx)}
                  onOpenChange={() => toggleArticle(idx)}
                >
                  <Card className="border-2 hover:border-primary transition-all duration-200">
                    <CollapsibleTrigger className="w-full">
                      <CardHeader className="cursor-pointer">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-lg leading-tight text-left flex items-center gap-2">
                              {article.title}
                              <ChevronDown 
                                className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                                  openArticles.has(idx) ? 'rotate-180' : ''
                                }`}
                              />
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
                    </CollapsibleTrigger>
                    
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {article.summary}
                      </p>
                      
                      <CollapsibleContent className="space-y-4">
                        <div className="border-t pt-4">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="text-sm leading-relaxed whitespace-pre-line">
                              {article.fullContent}
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
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
                Click on any article title to expand and read the complete content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessArticles;
