export const Role = {
  platformAdmin: 1,
  centerAdmin: 2,
  student: 3,
  teacher: 4,
  guest: 5,
};
export const UserGender = {
  male: 0,
  female: 1,
  other: 2,
};
export const CenterAdminLevel = {
  main: 1,
  mem: 0,
};
export const UserStatus = {
  active: 1,
  inactive: 0,
  pending: 2,
  locked: 3,
};
export const CenterStatus = {
  inactive: 0,
  active: 1,
  pending: 2,
  locked: 3,
};
export const Object = {
  course: 1,
  teacher: 2,
  center: 3,
};
export const APIStatus = {
  success: 200,
};
export const AssignmentType = {
  manual: 1,
  quiz: 2,
  code: 3,
};
export const AssignmentItemAnswerType = {
  text: 1,
  attached_file: 2,
};
export const AssignmentStatus = {
  publish: 1,
  unpublish: 0,
  pastDue: 2,
  upComing: 3,
  completed: 4,
};
export const AssignmentItemStatus = {
  active: 1,
  inactive: 0,
};
export const AssignmentResultStatus = {
  inactive: 0,
  onTime: 1,
  late: 2,
  submitted: 3,
};
export const NotificationType = {
  qualification: 1,
  assignedTeacher: 2,
  notificationBoard: 3,
  comment: 4,
};
export const ExecutedCodeStatus = {
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  COMPILATION_ERROR: 6,
  INTERNAL_ERROR: 13,
  EXEC_FORMAT_ERROR: 14,
};
export const LectureStatus = {
  inactive: 0,
  active: 1,
  pending: 2,
  rejected: 3,
};
