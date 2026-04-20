export type AboutTimelineItem = {
  year: string;
  title: string;
  text: string;
  tag?: string;
};

export type AboutContent = {
  heroTitle: string;
  heroItalicWord: string;
  bioP1: string;
  bioP2: string;
  portraitImageUrl: string;
  quote: string;
  quoteLabel: string;
  silenceTitle: string;
  silenceText: string;
  silenceImageUrl: string;
  timelineEyebrow: string;
  timelineTitle: string;
  timeline: AboutTimelineItem[];
};

