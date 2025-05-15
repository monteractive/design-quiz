import React, { useState, useEffect } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend
} from 'recharts'; // Using recharts for the radar chart

// Assume Tailwind CSS is available in the environment

// Define the archetypes and their descriptions
const archetypes = {
  'Visual Specialist': 'The Visual Specialist is detail-obsessed and focused on polished, pixel-perfect, and consistent designs. They are experts in visual design and elevate the quality of any product they touch.',
  'Strategist': 'Fueled by imagination and creativity, the Strategist excels at long term thinking, concept design, strategy and innovation. They have a deep understanding of the industry and use effective techniques to sell ideas.',
  'Interaction Expert': 'An interaction expert creates intuitive user journeys with carefully designed happy paths, guiding users with thoughtful hierarchy, micro-interactions, transitions, and animations. They possess deep knowledge of platform-specific interaction patterns and accessibility guidelines.',
  'Prototyper': 'Prototyping experts excel at rapid iteration. Typically proficient with multiple prototyping tools and skillfully select the appropriate fidelity level for different stages of the design process. They use prototypes to communicate vision and collect early feedback that drives design decisions.',
  'Systems Expert': 'System experts simplify the most complex systems and connect the dots across teams. They are experts at zooming in and out, always considering the larger context.',
  'Communication Expert': 'The Communication Expert is a master storyteller. They know how to frame even the toughest topics persuasively, presenting complex or challenging ideas in a compelling and accessible way that helps teams arrive at a unified solution.',
  'Insights Analyst': 'The Insights Expert excels at interrogating data and revealing new insights that power innovation. They have a deep well of knowledge and are continuously sharing it to elevate work around them.',
  'Voice Expert': 'A Voice Expert is a master of identity and strategy. They ensure consistent and compelling communications across all channels. They understand market trends and customer needs, translating them into a unique and resonant voice.',
};

// Define the quiz questions and their scoring logic
// Each question has a type, text, and options.
// Options have a value and a 'scores' object mapping archetype names to points.
const quizQuestions = [
  {
    id: 'q1_skill_visual',
    type: 'range',
    text: 'How would you rate your current skill level in creating visually polished and pixel-perfect designs?',
    range: { min: 1, max: 5, minLabel: 'Beginner', maxLabel: 'Expert' },
    scoring: { // Scoring based on the range value
      1: { 'Visual Specialist': 1 },
      2: { 'Visual Specialist': 2 },
      3: { 'Visual Specialist': 3, 'Prototyper': 1, 'Voice Expert': 1 },
      4: { 'Visual Specialist': 4, 'Prototyper': 2, 'Voice Expert': 2 },
      5: { 'Visual Specialist': 5, 'Prototyper': 3, 'Voice Expert': 3 },
    },
  },
  {
    id: 'q2_skill_strategy',
    type: 'range',
    text: 'Rate your comfort level with defining high-level product strategy and contributing to concept development early in a project.',
    range: { min: 1, max: 5, minLabel: 'Not Comfortable', maxLabel: 'Very Comfortable' },
    scoring: {
      1: { 'Strategist': 1 },
      2: { 'Strategist': 2 },
      3: { 'Strategist': 3, 'Systems Expert': 1, 'Insights Analyst': 1, 'Voice Expert': 1 },
      4: { 'Strategist': 4, 'Systems Expert': 2, 'Insights Analyst': 2, 'Voice Expert': 2 },
      5: { 'Strategist': 5, 'Systems Expert': 3, 'Insights Analyst': 3, 'Voice Expert': 3 },
    },
  },
  {
    id: 'q3_skill_interaction',
    type: 'range',
    text: 'How skilled do you feel in designing intuitive user interactions, including transitions and animations?',
    range: { min: 1, max: 5, minLabel: 'Beginner', maxLabel: 'Expert' },
    scoring: {
      1: { 'Interaction Expert': 1 },
      2: { 'Interaction Expert': 2 },
      3: { 'Interaction Expert': 3, 'Prototyper': 1, 'Systems Expert': 1 },
      4: { 'Interaction Expert': 4, 'Prototyper': 2, 'Systems Expert': 2 },
      5: { 'Interaction Expert': 5, 'Prototyper': 3, 'Systems Expert': 3 },
    },
  },
  {
    id: 'q4_skill_prototyping',
    type: 'range',
    text: 'Rate your proficiency in rapidly creating and iterating on prototypes using various tools.',
    range: { min: 1, max: 5, minLabel: 'Beginner', maxLabel: 'Expert' },
    scoring: {
      1: { 'Prototyper': 1 },
      2: { 'Prototyper': 2 },
      3: { 'Prototyper': 3, 'Interaction Expert': 1, 'Insights Analyst': 1 },
      4: { 'Prototyper': 4, 'Interaction Expert': 2, 'Insights Analyst': 2 },
      5: { 'Prototyper': 5, 'Interaction Expert': 3, 'Insights Analyst': 3 },
    },
  },
  {
    id: 'q5_skill_systems',
    type: 'range',
    text: 'How comfortable are you with analyzing complex systems and understanding how different parts connect across a product or organization?',
    range: { min: 1, max: 5, minLabel: 'Not Comfortable', maxLabel: 'Very Comfortable' },
    scoring: {
      1: { 'Systems Expert': 1 },
      2: { 'Systems Expert': 2 },
      3: { 'Systems Expert': 3, 'Strategist': 1, 'Interaction Expert': 1, 'Insights Analyst': 1 },
      4: { 'Systems Expert': 4, 'Strategist': 2, 'Interaction Expert': 2, 'Insights Analyst': 2 },
      5: { 'Systems Expert': 5, 'Strategist': 3, 'Interaction Expert': 3, 'Insights Analyst': 3 },
    },
  },
  {
    id: 'q6_skill_communication',
    type: 'range',
    text: 'Rate your ability to clearly and persuasively communicate design ideas, especially when dealing with challenging topics or diverse stakeholders.',
    range: { min: 1, max: 5, minLabel: 'Limited Ability', maxLabel: 'High Ability' },
    scoring: {
      1: { 'Communication Expert': 1 },
      2: { 'Communication Expert': 2 },
      3: { 'Communication Expert': 3, 'Voice Expert': 1, 'Strategist': 1 },
      4: { 'Communication Expert': 4, 'Voice Expert': 2, 'Strategist': 2 },
      5: { 'Communication Expert': 5, 'Voice Expert': 3, 'Strategist': 3 },
    },
  },
  {
    id: 'q7_skill_insights',
    type: 'range',
    text: 'How skilled do you feel in using data and research to uncover user needs and translate insights into design solutions?',
    range: { min: 1, max: 5, minLabel: 'Beginner', maxLabel: 'Expert' },
    scoring: {
      1: { 'Insights Analyst': 1 },
      2: { 'Insights Analyst': 2 },
      3: { 'Insights Analyst': 3, 'Voice Expert': 1, 'Strategist': 1, 'Systems Expert': 1 },
      4: { 'Insights Analyst': 4, 'Voice Expert': 2, 'Strategist': 2, 'Systems Expert': 2 },
      5: { 'Insights Analyst': 5, 'Voice Expert': 3, 'Strategist': 3, 'Systems Expert': 3 },
    },
  },
  {
    id: 'q8_pref_activities',
    type: 'sorting',
    text: 'Rank the following activities by how much you enjoy them, from most enjoyable (1) to least enjoyable (6).',
    options: [
      { value: 'visual_details', text: 'Focusing on visual details and aesthetics.', scores: { 'Visual Specialist': 6, 'Voice Expert': 2 } },
      { value: 'long_term_strategy', text: 'Thinking about long-term vision and strategy.', scores: { 'Strategist': 6, 'Systems Expert': 3, 'Insights Analyst': 3, 'Voice Expert': 3 } },
      { value: 'user_interactions', text: 'Mapping out user interactions and flows.', scores: { 'Interaction Expert': 6, 'Prototyper': 3, 'Systems Expert': 3 } },
      { value: 'prototyping', text: 'Building and testing prototypes.', scores: { 'Prototyper': 6, 'Interaction Expert': 3, 'Insights Analyst': 3 } },
      { value: 'complex_systems', text: 'Understanding complex systems and structures.', scores: { 'Systems Expert': 6, 'Strategist': 3, 'Interaction Expert': 3, 'Insights Analyst': 3 } },
      { value: 'data_analysis', text: 'Analyzing data and research findings.', scores: { 'Insights Analyst': 6, 'Strategist': 3, 'Voice Expert': 3 } },
    ],
    // Scoring will be based on rank: Rank 1 gets max points, Rank 6 gets min points for its associated archetype.
    // The 'scores' in options define the *maximum* points for that option if ranked first.
  },
  {
    id: 'q9_pref_voice',
    type: 'range',
    text: 'How much do you enjoy crafting messaging and defining the "voice" or identity of a product or brand?',
    range: { min: 1, max: 5, minLabel: 'Not at all', maxLabel: 'Very much' },
    scoring: {
      1: { 'Voice Expert': 1 },
      2: { 'Voice Expert': 2 },
      3: { 'Voice Expert': 3, 'Communication Expert': 1, 'Visual Specialist': 1 },
      4: { 'Voice Expert': 4, 'Communication Expert': 2, 'Visual Specialist': 2 },
      5: { 'Voice Expert': 5, 'Communication Expert': 3, 'Visual Specialist': 3 },
    },
  },
  {
    id: 'q10_pref_collaboration',
    type: 'range',
    text: 'How much do you enjoy collaborating closely with team members from different disciplines (e.g., engineering, product, research)?',
    range: { min: 1, max: 5, minLabel: 'Not at all', maxLabel: 'Very much' },
    scoring: {
      1: { 'Interaction Expert': 1, 'Systems Expert': 1, 'Communication Expert': 1 },
      2: { 'Interaction Expert': 2, 'Systems Expert': 2, 'Communication Expert': 2 },
      3: { 'Interaction Expert': 3, 'Systems Expert': 3, 'Communication Expert': 3 },
      4: { 'Interaction Expert': 4, 'Systems Expert': 4, 'Communication Expert': 4 },
      5: { 'Interaction Expert': 5, 'Systems Expert': 5, 'Communication Expert': 5 },
    },
  },
  {
    id: 'q11_aspire_axes',
    type: 'sorting',
    text: 'Looking ahead, which of these areas is most important for you to develop further in your career? Rank from most important (1) to least important (4).',
    options: [
      { value: 'innovation', text: 'Innovation (Exploring new ideas, pushing boundaries)', scores: { 'Strategist': 4, 'Prototyper': 4, 'Insights Analyst': 4, 'Voice Expert': 4, 'Visual Specialist': 4 } },
      { value: 'leadership', text: 'Leadership (Guiding teams, influencing direction)', scores: { 'Strategist': 4, 'Communication Expert': 4, 'Visual Specialist': 4, 'Voice Expert': 4 } },
      { value: 'execution', text: 'Execution (Efficiently and effectively bringing designs to reality)', scores: { 'Visual Specialist': 4, 'Interaction Expert': 4, 'Prototyper': 4, 'Systems Expert': 4, 'Insights Analyst': 4, 'Communication Expert': 4, 'Voice Expert': 4 } }, // All archetypes have an execution component
      { value: 'teamwork', text: 'Teamwork (Collaborating and enabling others)', scores: { 'Interaction Expert': 4, 'Systems Expert': 4, 'Communication Expert': 4 } },
    ],
    // Scoring based on rank. Rank 1 gets max points (4), Rank 4 gets min points (1).
  },
  {
    id: 'q12_aspire_impact',
    type: 'multiple-choice',
    text: 'What kind of impact do you ultimately want to have with your design work? (Select the one that resonates most strongly)',
    options: [
      { value: 'visual_stunning', text: 'Create visually stunning and highly refined experiences.', scores: { 'Visual Specialist': 5 } },
      { value: 'shape_strategy', text: 'Shape the overall direction and strategy of products/services.', scores: { 'Strategist': 5 } },
      { value: 'systems_intuitive', text: 'Make complex systems understandable and intuitive for users.', scores: { 'Interaction Expert': 5, 'Systems Expert': 5 } },
      { value: 'bring_ideas_life', text: 'Bring new ideas to life quickly and prove their value.', scores: { 'Prototyper': 5 } },
      { value: 'data_insights', text: 'Ensure decisions are grounded in deep user understanding and data.', scores: { 'Insights Analyst': 5 } },
      { value: 'influence_communication', text: 'Influence outcomes through clear and compelling communication.', scores: { 'Communication Expert': 5, 'Voice Expert': 5 } },
      { value: 'brand_identity', text: 'Define and strengthen the brand\'s identity and voice.', scores: { 'Voice Expert': 5, 'Visual Specialist': 5 } },
    ],
  },
  {
    id: 'q13_aspire_project',
    type: 'multiple-choice',
    text: 'If you could focus on one primary area for your next major project, which would it be? (Select the one that appeals most)',
    options: [
      { value: 'visual_styleguide', text: 'Redefining the visual style guide for a product.', scores: { 'Visual Specialist': 5 } },
      { value: 'strategic_roadmap', text: 'Developing the strategic roadmap for a new initiative.', scores: { 'Strategist': 5 } },
      { value: 'user_workflow_redesign', text: 'Redesigning a core user workflow for better usability.', scores: { 'Interaction Expert': 5 } },
      { value: 'prototype_experiment', text: 'Experimenting with a new technology by building a quick prototype.', scores: { 'Prototyper': 5 } },
      { value: 'system_mapping', text: 'Mapping out dependencies in a complex service ecosystem.', scores: { 'Systems Expert': 5 } },
      { value: 'executive_presentation', text: 'Crafting a presentation to get executive buy-in for a controversial design choice.', scores: { 'Communication Expert': 5 } },
      { value: 'analytics_deepdive', text: 'Deep-diving into analytics to understand why users are dropping off.', scores: { 'Insights Analyst': 5 } },
      { value: 'brand_voice_consistency', text: 'Ensuring consistent brand voice across all user touchpoints.', scores: { 'Voice Expert': 5 } },
    ],
  },
];

// Colors for the radar chart
const RADAR_COLOR = '#8884d8'; // A single color for the radar line

// Component to render a Range question
const RangeQuestion = ({ question, answer, onAnswerChange }) => {
  const { id, text, range } = question;
  const value = answer || range.min; // Default to min value if no answer yet

  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm">
      <label className="block text-lg font-semibold mb-2">{text}</label>
      <div className="flex items-center space-x-4">
        <span>{range.minLabel}</span>
        <input
          type="range"
          min={range.min}
          max={range.max}
          value={value}
          onChange={(e) => onAnswerChange(id, parseInt(e.target.value))}
          className="flex-grow"
        />
        <span>{range.maxLabel}</span>
        <span className="font-bold">{value}</span>
      </div>
    </div>
  );
};

// Component to render a Multiple Choice question
const MultipleChoiceQuestion = ({ question, answer, onAnswerChange }) => {
  const { id, text, options } = question;

  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm">
      <label className="block text-lg font-semibold mb-2">{text}</label>
      <div className="flex flex-col space-y-2">
        {options.map(option => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name={id}
              value={option.value}
              checked={answer === option.value}
              onChange={() => onAnswerChange(id, option.value)}
            />
            <span className="ml-2">{option.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Component to render a Sorting question
const SortingQuestion = ({ question, answer, onAnswerChange }) => {
  const { id, text, options } = question;
  const [items, setItems] = useState(
    answer && answer.length === options.length 
      ? answer.map(value => options.find(opt => opt.value === value))
      : options
  );
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);

  const handleDragStart = (e, position) => {
    e.target.style.opacity = '0.4';
    setDraggedItem(position);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, position) => {
    e.preventDefault();
    e.target.classList.add('bg-blue-100');
    setDraggedOverItem(position);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.classList.remove('bg-blue-100');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropPosition) => {
    e.preventDefault();
    e.target.classList.remove('bg-blue-100');
    
    const itemsCopy = [...items];
    const draggedItemContent = itemsCopy[draggedItem];
    
    // Remove item from old position
    itemsCopy.splice(draggedItem, 1);
    // Add item to new position
    itemsCopy.splice(dropPosition, 0, draggedItemContent);
    
    setItems(itemsCopy);
    // Update parent with new order
    onAnswerChange(id, itemsCopy.map(item => item.value));
    
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    e.target.classList.remove('bg-blue-100');
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{text}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.value}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`
              p-4 bg-white border border-gray-200 rounded-lg shadow-sm
              flex items-center gap-3 cursor-move select-none
              transition-all duration-200 ease-in-out
              hover:shadow-md hover:border-blue-300
              ${draggedOverItem === index ? 'border-blue-500 bg-blue-50' : ''}
              ${draggedItem === index ? 'opacity-40' : 'opacity-100'}
            `}
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold">
              {index + 1}
            </span>
            <span className="text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500 italic">Drag and drop items to reorder them</p>
    </div>
  );
};


// Main App Component
const App = () => {
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [archetypeScores, setArchetypeScores] = useState({});
  const [sortedResults, setSortedResults] = useState([]);
  const [radarChartData, setRadarChartData] = useState([]);
  const [maxScore, setMaxScore] = useState(0);


  // Handle answer change for any question type
  const handleAnswerChange = (questionId, answer) => {
    setCurrentAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // Calculate scores when quiz is complete or answers change
  useEffect(() => {
    if (quizComplete) {
      const scores = {};
      // Initialize scores for all archetypes to 0
      Object.keys(archetypes).forEach(archetype => {
        scores[archetype] = 0;
      });

      // Calculate scores based on current answers
      quizQuestions.forEach(question => {
        const answer = currentAnswers[question.id];

        if (answer !== undefined) {
          if (question.type === 'range') {
            // For range questions, score is based on the value
            const value = parseInt(answer);
            if (question.scoring[value]) {
              Object.entries(question.scoring[value]).forEach(([archetype, points]) => {
                scores[archetype] += points;
              });
            }
          } else if (question.type === 'multiple-choice') {
            // For multiple choice, score is based on the selected option's scores
            const selectedOption = question.options.find(opt => opt.value === answer);
            if (selectedOption && selectedOption.scores) {
              Object.entries(selectedOption.scores).forEach(([archetype, points]) => {
                scores[archetype] += points;
              });
            }
          } else if (question.type === 'sorting') {
            // For sorting, score is based on the rank of each option
            const rankedOptions = answer; // answer is an array of sorted option values
            rankedOptions.forEach((optionValue, index) => {
              const originalOption = question.options.find(opt => opt.value === optionValue);
              if (originalOption && originalOption.scores) {
                 // Calculate points based on rank. Higher rank (closer to 1) gets more points.
                const maxPoints = Object.values(originalOption.scores).reduce((sum, pts) => sum + pts, 0); // Sum of max points for this option
                const rank = index + 1;
                const pointsMultiplier = (question.options.length - rank + 1) / question.options.length; // Example: Rank 1 gets 1x, Rank 6 gets 1/6x
                 Object.entries(originalOption.scores).forEach(([archetype, points]) => {
                    scores[archetype] += points * pointsMultiplier; // Distribute points based on original scores and rank
                  });
              }
            });
          }
        }
      });

      setArchetypeScores(scores);

      // Sort results for the list display
      const sorted = Object.entries(scores)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score);
      setSortedResults(sorted);

      // Prepare data for the radar chart
      // Radar chart data needs an array where each object represents an axis point (an archetype)
      // and contains the score for that archetype.
      const radarData = Object.entries(scores).map(([name, score]) => ({
        subject: name, // The archetype name becomes the axis label
        A: score, // The score value for this archetype
        fullMark: 50, // You might need to adjust this based on your max possible score
      }));
      setRadarChartData(radarData);

      // Calculate the maximum possible score across all archetypes for the radar chart's max value
      // This is a simplified calculation; a more precise one would sum max points per question per archetype
      const calculatedMaxScore = Object.values(scores).reduce((max, current) => Math.max(max, current), 0) * 1.2; // Add a buffer
      setMaxScore(calculatedMaxScore > 0 ? calculatedMaxScore : 10); // Ensure a minimum max score
    }
  }, [currentAnswers, quizComplete]); // Recalculate when answers or quizComplete state changes

  // Check if all questions are answered to enable completing the quiz
  const allQuestionsAnswered = quizQuestions.every(question => {
    const answer = currentAnswers[question.id];
    if (question.type === 'sorting') {
      // For sorting, check if the answer is an array with the correct number of elements
      return Array.isArray(answer) && answer.length === question.options.length;
    }
    // For other types, just check if an answer exists
    return answer !== undefined;
  });

  const handleCompleteQuiz = () => {
    if (allQuestionsAnswered) {
      setQuizComplete(true);
    } else {
      alert('Please answer all questions before completing the quiz.');
    }
  };

  // Get the top scoring archetype
  const topArchetype = sortedResults.length > 0 ? sortedResults[0] : null;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Designer Archetype Quiz</h1>

      {!quizComplete ? (
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-700 mb-6 text-center">
            This quiz will help you explore potential design archetypes based on your skills, interests, and aspirations. Your results will be a scored list and a radar chart to help you reflect on your strengths and potential growth paths.
          </p>
          {quizQuestions.map(question => {
            // Render different component based on question type
            if (question.type === 'range') {
              return (
                <RangeQuestion
                  key={question.id}
                  question={question}
                  answer={currentAnswers[question.id]}
                  onAnswerChange={handleAnswerChange}
                />
              );
            } else if (question.type === 'multiple-choice') {
              return (
                <MultipleChoiceQuestion
                  key={question.id}
                  question={question}
                  answer={currentAnswers[question.id]}
                  onAnswerChange={handleAnswerChange}
                />
              );
            } else if (question.type === 'sorting') {
               return (
                <SortingQuestion
                  key={question.id}
                  question={question}
                  answer={currentAnswers[question.id]}
                  onAnswerChange={handleAnswerChange}
                />
              );
            }
            return null; // Or handle unknown question types
          })}

          <button
            onClick={handleCompleteQuiz}
            disabled={!allQuestionsAnswered}
            className={`w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ${!allQuestionsAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Complete Quiz
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Your Archetype Results</h2>

          {/* Suggested Archetype Section */}
          {topArchetype && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md border-t-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Suggested Archetype: {topArchetype.name}</h3>
              {/*
                To add an image here, you would need a separate image file for each archetype.
                For example: <img src={`/images/${topArchetype.name.toLowerCase().replace(' ', '_')}.png`} alt={topArchetype.name} className="w-32 h-32 mx-auto mb-4 rounded-full object-cover"/>
                Replace `/images/` with the actual path to your image files.
              */}
              <p className="text-gray-700">{archetypes[topArchetype.name]}</p>
            </div>
          )}


          {/* Radar Chart */}
          <div className="w-full h-80 mb-8">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  {/* PolarRadiusAxis allows showing score values */}
                  <PolarRadiusAxis angle={30} domain={[0, maxScore]} />
                  <Radar name="Your Score" dataKey="A" stroke={RADAR_COLOR} fill={RADAR_COLOR} fillOpacity={0.6} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)} points`} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
          </div>


          {/* Scored List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Full Scored List</h3>
            {sortedResults.map(result => (
              <div key={result.name} className="mb-4 pb-4 border-b last:border-b-0">
                <h4 className="text-lg font-bold text-gray-700">{result.name} - {result.score.toFixed(2)} points</h4>
                <p className="text-gray-600 text-sm mt-1">{archetypes[result.name]}</p>
              </div>
            ))}
          </div>

           <button
            onClick={() => setQuizComplete(false)}
            className="mt-8 w-full px-6 py-3 bg-gray-300 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
          >
            Take Quiz Again
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
