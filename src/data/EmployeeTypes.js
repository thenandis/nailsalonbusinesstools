export const FICA = 0.0765;
export const WORKERS_COMP = 0.0254;

export const employeeTypes = [
  { value: 'W2', label: 'W2 Employee' },
  { value: '1099', label: '1099 Contractor' }
];

// Default values for the calculator
export const defaultValues = {
  employeeType: 'W2',
  wage: 15,
  hours: 40
};