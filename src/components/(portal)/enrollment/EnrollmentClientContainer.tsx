'use client';

import EnrollmentForm from './EnrollmentForm';

export type EnrollmentClientContainerProps = {
	schoolYears: { start_year: string; end_year: string }[];
	gradeLevels: { grade_level: string }[];
};

export default function EnrollmentClientContainer({
	schoolYears,
	gradeLevels
}: EnrollmentClientContainerProps) {
	return (
		<div className='w-11/12 max-w-4xl my-5 mx-auto space-y-5'>
			<div className='space-y-1'>
				<h1 className='font-bold text-lg'>Enrollment Management</h1>

				<p className='text-sm text-muted-foreground'>
					Manage student enrollments and process enrollment requests for
					new students.
				</p>
			</div>

			<EnrollmentForm schoolYears={schoolYears} gradeLevels={gradeLevels} />
		</div>
	);
}
