'use client'

// Landing page for external tools that are useful for Chinese language students.

import { useState } from 'react';
import { FilterChips } from '@/components/ui/FilterChips';


interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon?: string;
}

const tools: Tool[] = [
  {
    id: 'rapid-fire-audio',
    name: "Rapid Fire Audio",
    description: "DLI student-built app for practicing listening comprehension",
    url: "https://rapid-fire-audio2.netlify.app",
    category: "Listening",
    icon: "⚡🎧"
  },
  {
    id: 'presentation-playlist',
    name: "Presentation Playlist",
    description: "DLI student-built app for listening to every presentation",
    url: "https://presentation-playlist.netlify.app/",
    category: "Listening",
    icon: "🎙️"
  },
  {
    id: 'migaku',
    name: 'Migaku',
    description: "Chinese learning companion that generates subtitles and flashcards from the content you watch and read. AI-assisted and highly recommended by successful DLI students, this app and browser extension can boost your Chinese learning.",
    url: "https://migaku.com/learn-chinese",
    category: "Learning",
    icon: "〽️"
  },
  {
    id: 'number-practice',
    name: "Number Practice",
    description: "Processing numbers in a foreign language is surprisingly hard. Train your ear with this website's rapid-fire drills.",
    url: "https://langpractice.com/mandarin-china/numbers/listening#1,0,10",
    category: "Listening",
    icon: "🔢"
  },
  {
    id: 'pinyin-practice',
    name: "Pinyin Practice",
    description: "Practice pinyin and tones with simple drills.",
    url: "https://www.archchinese.com/mandarin_chinese_tone_drill.html",
    category: "Listening",
    icon: "拼音"
  },
  {
    id: 'duchinese',
    name: 'Du Chinese',
    description: "Graded Chinese reading app with stories for every level.",
    url: 'https://duchinese.net/',
    category: "Reading",
    icon: '📚'
  },
  {
    id: 'pleco',
    name: 'Pleco',
    description: 'The best Chinese dictionary app with OCR, flashcards, and document reader',
    url: 'https://www.pleco.com/',
    category: 'Dictionary',
    icon: '📖',
  },
  {
    id: 'yoyochinese',
    name: 'Yoyo Chinese',
    description: 'Video lessons covering pinyin, tones, grammar, and conversational Chinese',
    url: 'https://yoyochinese.com/',
    category: 'Learning',
    icon: '🎬',
  },
  {
    id: 'chinesegrammarwiki',
    name: 'Chinese Grammar Wiki',
    description: 'Comprehensive grammar reference organized by level (A1-C1)',
    url: 'https://resources.allsetlearning.com/chinese/grammar/',
    category: 'Reference',
    icon: '📝',
  },
  {
    id: 'chinesepod',
    name: 'ChinesePod',
    description: 'Podcast-based lessons for all levels with transcripts and vocabulary',
    url: 'https://chinesepod.com/',
    category: 'Listening',
    icon: '🎧',
  },
  {
    id: 'skritter',
    name: 'Skritter',
    description: 'Learn to write Chinese characters with stroke-by-stroke feedback',
    url: 'https://skritter.com/',
    category: 'Writing',
    icon: '✍️',
  },
];

const categories = [...new Set(tools.map(t => t.category))];

export default function ToolsPage() {


  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl">🛠️</span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">External Tools</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Curated resources to enhance your Mandarin learning journey
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            aria-label="Search tools"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="flex-1 sm:w-80 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <FilterChips options={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            No tools found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map(tool => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group cursor-pointer"
              >
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-800 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tool.icon}</span>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.name}
                      </h3>
                    </div>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium ml-2 shrink-0">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <span>🔗</span> External link
                    </span>
                    <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-medium">
                      Visit →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
          All external tools open in a new tab. Hanzi Hub is not affiliated with these services.
        </div>
      </main>
    </div>
  );
}
