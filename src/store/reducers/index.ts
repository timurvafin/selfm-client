import tasksReducer from './tasks';
import projectsReducer from './projects';
import sectionsReducer from './sections';


export default function (state, action) {
  const tasks = tasksReducer(state && state.tasks, action);
  const projects = projectsReducer(state && state.projects, action);
  const sections = sectionsReducer(state && state.sections, action);

  return {
    tasks,
    projects,
    sections,
  };
}