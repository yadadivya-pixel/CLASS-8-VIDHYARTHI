
import React from 'react';
import type { Subject, Book, Chapter, QuizResult, ReportData } from '../types';
import Spinner from './Spinner';

interface ReportScreenProps {
  results: QuizResult[];
  subject: Subject;
  book: Book;
  chapter: Chapter;
  preGeneratedReport: ReportData | null;
  isGenerating: boolean;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ results, chapter, preGeneratedReport, isGenerating }) => {

  if (isGenerating && !preGeneratedReport) {
    return (
      <div className="text-center py-20">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">Analyzing your performance and generating your report card...</p>
      </div>
    );
  }

  if (!preGeneratedReport) {
    const errorMessage = results.length === 0
      ? "No quiz data available to generate a report."
      : "Could not generate the report due to an error. Please try again.";
      
    return (
      <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Could not generate report.</h2>
          <p>{errorMessage}</p>
      </div>
    );
  }

  const report = preGeneratedReport;
  const scoreColor = report.score >= 75 ? 'text-green-600' : report.score >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 animate-fade-in w-full">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark text-center mb-2">Your Report Card</h1>
      <p className="text-center text-gray-500 mb-8">For {chapter.name}</p>

      <div className="text-center bg-gray-50 p-6 rounded-xl mb-8">
        <p className="text-lg text-gray-600">Your Score</p>
        <p className={`text-7xl font-bold my-2 ${scoreColor}`}>{report.score}%</p>
        <p className="text-md text-gray-700 max-w-2xl mx-auto">{report.summary}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Strengths</h2>
            <ul className="list-disc list-inside space-y-2 text-green-700">
                {report.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
            </ul>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Key Topics to Review</h2>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
                {report.reviewTopics.map((topic, i) => <li key={i}>{topic}</li>)}
            </ul>
        </div>
      </div>

      {report.topicAnalysis && report.topicAnalysis.length > 0 && (
          <div className="mb-8">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">Topic Analysis</h2>
              <div className="space-y-4">
                  {report.topicAnalysis.map((analysis, i) => (
                      <div key={i} className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
                          <h3 className="font-bold text-lg text-indigo-800 mb-2">{analysis.topic}</h3>
                          <p className="text-indigo-700 mb-2"><span className="font-semibold">Performance:</span> {analysis.performance}</p>
                          <p className="text-indigo-700"><span className="font-semibold">Recommendation:</span> {analysis.recommendation}</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-brand-dark mb-4">Areas for Improvement</h2>
        <div className="space-y-6">
          {report.improvementAreas.map((area, i) => (
            <div key={i} className="bg-red-50 p-5 rounded-xl border border-red-200">
              <p className="font-semibold text-lg text-red-800 mb-3">{area.question}</p>
              <div className="text-sm space-y-2">
                <p><span className="font-bold">Your Answer:</span> <span className="text-red-700">{area.userAnswer}</span></p>
                <p><span className="font-bold">Correct Answer:</span> <span className="text-green-700">{area.correctAnswer}</span></p>
                <p className="mt-2 pt-2 border-t border-red-100"><span className="font-bold">Explanation:</span> {area.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;
