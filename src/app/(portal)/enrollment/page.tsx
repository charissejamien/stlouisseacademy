import type { Metadata } from 'next';
import EnrollmentClientContainer from '@/components/(portal)/enrollment/EnrollmentClientContainer';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
	title: 'Enrollment | St. Louisse Academy'
};

export default async function Enrollment() {
	const supabase = await createClient();

	const { data: schoolYears } = await supabase
		.from('school_years')
		.select('start_year, end_year');

	const { data: gradeLevels } = await supabase
		.from('grade_levels')
		.select('grade_level')
		.order('order_index', { ascending: true });

	return (
		<EnrollmentClientContainer
			schoolYears={schoolYears ?? []}
			gradeLevels={gradeLevels ?? []}
		/>
	);
}
