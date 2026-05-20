import client from './client';

const handleApiError = (err) => {
  const status = err.response?.status;
  const detail = err.response?.data?.detail;
  const message = detail || err.message || 'Request failed';
  // Log to browser console so the cause is visible in devtools, not just the UI banner.
  // eslint-disable-next-line no-console
  console.error('[API error]', err.config?.method?.toUpperCase(), err.config?.url, status, message, err);
  return { error: true, status, message };
};

export const loginUser = async (email, password) => {
  try {
    const res = await client.post('/api/auth/login', { email, password });
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const res = await client.post('/api/auth/register', { name, email, password });
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const uploadResume = async (file) => {
  try {
    const formData = new FormData(); 
    formData.append('file', file);
    const res = await client.post('/api/resume/upload', formData);
    localStorage.setItem('resume_id', res.data.resume_id);
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getATSScore = async (resumeId, jobDescription) => {
  try {
    const res = await client.post('/api/ats/score', { resume_id: resumeId, job_description: jobDescription });
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const curateResume = async (resumeId, jobDescription) => {
  try {
    const res = await client.post('/api/curator/curate', { resume_id: resumeId, job_description: jobDescription });
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const searchJobs = async (filters = {}) => {
  try {
    const resumeId = localStorage.getItem('resume_id');
    const params = {};
    if (filters.title) params.query = filters.title;
    if (filters.location) params.location = filters.location;
    if (filters.mode && !filters.mode.toLowerCase().startsWith('any')) params.mode = filters.mode;
    if (filters.experience && !filters.experience.toLowerCase().startsWith('any')) params.experience = filters.experience;
    if (filters.minSalary) params.salary_min = filters.minSalary;
    const config = resumeId ? { headers: { 'X-Resume-Id': resumeId } } : {};
    const res = await client.get('/api/jobs', { params, ...config });
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getSkillGap = async (resumeId, targetRole) => {
  try {
    const res = await client.post('/api/skills/gap', { resume_id: resumeId, target_role: targetRole });
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const generateEmail = async (params) => {
  try {
    const res = await client.post('/api/email/generate', params);
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getApplications = async () => {
  try {
    const res = await client.get('/api/tracker');
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const addApplication = async (data) => {
  try {
    const res = await client.post('/api/tracker', data);
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const updateApplication = async (id, data) => {
  try {
    const res = await client.patch(`/api/tracker/${id}`, data);
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getInterviewQuestions = async (role, jobDescription) => {
  try {
    const res = await client.post('/api/interview/questions', { role, job_description: jobDescription });
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const evaluateAnswer = async (questionId, questionText, answerText, role) => {
  try {
    const res = await client.post('/api/interview/evaluate', { 
      question_id: questionId, 
      question_text: questionText, 
      answer_text: answerText, 
      role 
    });
    return res.data;
  } catch (err) {
    return handleApiError(err);
  }
};
