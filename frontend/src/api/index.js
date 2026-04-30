import { 
  mockATSResult, 
  mockCurationResult, 
  mockJobs, 
  mockSkillGap, 
  mockEmailResult, 
  mockApplications, 
  mockInterviewQuestions 
} from '../mock/data';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

export const uploadResume = async (file) => {
  await delay(2000);
  return { id: 'res_123', name: file.name };
};

export const getATSScore = async (resumeId, jd) => {
  await delay(1200);
  return mockATSResult;
};

export const curateResume = async (resumeId, jd) => {
  await delay(1500);
  return mockCurationResult;
};

export const searchJobs = async (filters) => {
  await delay(800);
  return mockJobs;
};

export const getSkillGap = async (resumeId, role) => {
  await delay(1200);
  return mockSkillGap;
};

export const generateEmail = async (params) => {
  await delay(1800);
  return mockEmailResult;
};

export const getApplications = async () => {
  await delay(600);
  return mockApplications;
};

export const addApplication = async (data) => {
  await delay(800);
  return { id: Math.random().toString(36).substr(2, 9), ...data };
};

export const updateApplication = async (id, data) => {
  await delay(500);
  return { id, ...data };
};

export const getInterviewQuestions = async (role) => {
  await delay(1200);
  return mockInterviewQuestions;
};

export const evaluateAnswer = async (questionId, answer) => {
  await delay(1500);
  return { 
    score: 3, 
    feedback: "Good use of situation context. Consider adding specific metrics to your Action step.",
    missing: ["Add metrics", "Clarify outcome"]
  };
};
