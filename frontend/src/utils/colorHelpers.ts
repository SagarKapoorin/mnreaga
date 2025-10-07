export const getPerformanceColor = (
  score: number
): { bg: string; border: string; text: string } => {
  if (score >= 80) {
    return {
      bg: 'bg-success-100',
      border: 'border-success-500',
      text: 'text-success-700',
    };
  } else if (score >= 60) {
    return {
      bg: 'bg-warning-100',
      border: 'border-warning-500',
      text: 'text-warning-700',
    };
  } else {
    return {
      bg: 'bg-danger-100',
      border: 'border-danger-500',
      text: 'text-danger-700',
    };
  }
};

export const getComparisonColor = (
  comparison: 'above' | 'below' | 'average'
): string => {
  switch (comparison) {
    case 'above':
      return 'text-success-600';
    case 'below':
      return 'text-danger-600';
    default:
      return 'text-gray-600';
  }
};


