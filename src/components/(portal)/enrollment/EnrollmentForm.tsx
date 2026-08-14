'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
	FieldTitle
} from '@/components/ui/field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Asterisk from '@/components/shared/Asterisk';
import {
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	Select
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { EnrollmentClientContainerProps } from './EnrollmentClientContainer';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const enrollmentSteps = [
	'Student Information',
	'Parent Information',
	'Fee Settlement'
] as const;
const suffixes = ['Jr.', 'II', 'III', 'IV', 'V'] as const;
const genders = ['Male', 'Female'] as const;
const studentTypes = ['New', 'Returning'] as const;

const studentSchema = z.object({
	students: z.array(
		z.object({
			school_year: z.string().min(1, 'School year is required'),
			grade_level: z.string().min(1, 'Grade level is required'),
			student_type: z.string().min(1, 'Student type is required'),
			lrn: z.string().min(12).max(12).optional().or(z.literal('')),
			first_name: z.string().min(2, 'First name is required'),
			middle_name: z.string().min(2, 'Middle name is required'),
			last_name: z.string().min(2, 'Last name is required'),
			suffix: z.enum(suffixes).optional(),
			adress: z.string().min(10, 'Home address is required'),
			date_of_birth: z.string().min(1, 'Date of birth is required'),
			gender: z.enum(genders)
		})
	)
});

const parentSchema = z.object({
	parent_first_name: z.string().min(2, 'First name is required'),
	parent_middle_name: z.string().min(2, 'Middle name is required'),
	parent_last_name: z.string().min(2, 'Last name is required'),
	parent_suffix: z.enum(suffixes).optional(),
	parent_contact_number: z.string().min(10, 'Contact number is required'),
	parent_email: z.string().min(10, 'Email is required'),
	parent_address: z.string().min(10, 'Address is required'),
	parent_gender: z.enum(genders)
});

const feeSettlementSchema = z.object({
	entrance_fee: z.number().min(1, 'Entrance fee is required')
});

const formSchema = z.object({
	...studentSchema.shape,
	...parentSchema.shape,
	...feeSettlementSchema.shape
});

type EnrollmentFormProps = {} & EnrollmentClientContainerProps;

type EnrollmentSteps =
	'Student Information' | 'Parent Information' | 'Fee Settlement';

export default function EnrollmentForm({
	schoolYears,
	gradeLevels
}: EnrollmentFormProps) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			students: [
				{
					school_year: '',
					grade_level: '',
					student_type: '',
					first_name: '',
					middle_name: '',
					last_name: '',
					suffix: undefined,
					adress: '',
					date_of_birth: '',
					gender: undefined
				}
			],
			parent_first_name: '',
			parent_middle_name: '',
			parent_last_name: '',
			parent_suffix: undefined,
			parent_contact_number: '',
			parent_email: '',
			parent_address: '',
			parent_gender: undefined,
			entrance_fee: 0
		},
		mode: 'onChange'
	});

	function onSubmit(data: z.infer<typeof formSchema>) {
		console.log(data);
	}

	const [enrollmentStep, setEnrollmentStep] = useState<EnrollmentSteps>(
		'Student Information'
	);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'students'
	});

	const { isSubmitting } = form.formState;

	const isPending = isSubmitting;

	const values = useWatch({ control: form.control });

	const isStudentStepValid = studentSchema.safeParse(values).success;
	const isParentStepValid = parentSchema.safeParse(values).success;
	const isFeeSettlementStepValid =
		feeSettlementSchema.safeParse(values).success;

	return (
		<Tabs
			value={enrollmentStep}
			onValueChange={value => setEnrollmentStep(value as EnrollmentSteps)}
		>
			<TabsList className='bg-card h-10!'>
				{enrollmentSteps.map((step, index) => (
					<TabsTrigger
						key={step}
						value={step}
						disabled={
							(step === 'Parent Information' && !isStudentStepValid) ||
							(step === 'Fee Settlement' &&
								(!isStudentStepValid || !isParentStepValid))
						}
						className='data-active:bg-accent px-2'
					>
						<Badge className='size-5'>{index + 1}</Badge> {step}
					</TabsTrigger>
				))}
			</TabsList>

			<form
				onSubmit={form.handleSubmit(onSubmit, errors => {
					console.log(errors);
				})}
			>
				<TabsContent
					value='Student Information'
					className='bg-card rounded-lg p-5 space-y-4'
				>
					{fields.map((field, index) => (
						<FieldSet key={field.id} className='gap-4 border-b pb-4'>
							<FieldTitle className='text-muted-foreground'>
								Academic Information
							</FieldTitle>

							<FieldGroup className='flex-row gap-3'>
								{(
									[
										{
											name: 'school_year',
											label: 'School Year',
											options: schoolYears.map(
												schoolYear =>
													`${schoolYear.start_year} - ${schoolYear.end_year}`
											)
										},
										{
											name: 'grade_level',
											label: 'Grade Level',
											options: gradeLevels.map(
												gradeLevel => gradeLevel.grade_level
											)
										},
										{
											name: 'student_type',
											label: 'Student Type',
											options: studentTypes
										}
									] as const
								).map(({ name, label, options }) => (
									<Controller
										key={name}
										name={`students.${index}.${name}`}
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>
													{label} <Asterisk />
												</FieldLabel>

												<Select
													name={field.name}
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger
														id={field.name}
														disabled={isPending}
														aria-invalid={fieldState.invalid}
													>
														<SelectValue
															placeholder={`Select ${label}`}
														/>
													</SelectTrigger>

													<SelectContent position='popper'>
														{options.map(option => (
															<SelectItem
																key={option}
																value={option}
															>
																{option}
															</SelectItem>
														))}
													</SelectContent>
												</Select>

												{fieldState.invalid && (
													<FieldError
														errors={[fieldState.error]}
													/>
												)}
											</Field>
										)}
									/>
								))}
							</FieldGroup>

							<FieldGroup>
								<Controller
									name={`students.${index}.lrn`}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Learner Reference Number (LRN)
											</FieldLabel>

											<Input
												{...field}
												id={field.name}
												disabled={isPending}
												placeholder='Enter your 12-digit LRN'
												minLength={12}
												maxLength={12}
											/>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</FieldGroup>

							<FieldTitle className='text-muted-foreground'>
								Personal Information
							</FieldTitle>

							<FieldGroup className='flex-row gap-3'>
								{(
									[
										{
											name: 'first_name',
											label: 'First Name',
											placeholder: 'John'
										},
										{
											name: 'middle_name',
											label: 'Middle Name',
											placeholder: 'Joseph'
										},
										{
											name: 'last_name',
											label: 'Last Name',
											placeholder: 'Doe'
										}
									] as const
								).map(({ name, label, placeholder }) => (
									<Controller
										key={name}
										name={`students.${index}.${name}`}
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>
													{label} <Asterisk />
												</FieldLabel>

												<Input
													{...field}
													id={field.name}
													disabled={isPending}
													aria-invalid={fieldState.invalid}
													placeholder={placeholder}
												/>

												{fieldState.invalid && (
													<FieldError
														errors={[fieldState.error]}
													/>
												)}
											</Field>
										)}
									/>
								))}

								<Controller
									name={`students.${index}.suffix`}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Suffix
											</FieldLabel>

											<Select
												name={field.name}
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													id={field.name}
													disabled={isPending}
													aria-invalid={fieldState.invalid}
												>
													<SelectValue placeholder='Select Suffix' />
												</SelectTrigger>

												<SelectContent position='popper'>
													{suffixes.map(suffix => (
														<SelectItem
															key={suffix}
															value={suffix}
														>
															{suffix}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</FieldGroup>

							<FieldGroup>
								<Controller
									name={`students.${index}.adress`}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Home Address <Asterisk />
											</FieldLabel>

											<Input
												{...field}
												id={field.name}
												disabled={isPending}
												aria-invalid={fieldState.invalid}
												placeholder='123 Rizal Street, Barangay Poblacion, Daanbantayan, Cebu 6013, Philippines'
											/>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</FieldGroup>

							<FieldGroup className='flex-row gap-3'>
								<Controller
									name={`students.${index}.date_of_birth`}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Date of Birth <Asterisk />
											</FieldLabel>

											<Input
												type='date'
												{...field}
												id={field.name}
												disabled={isPending}
												aria-invalid={fieldState.invalid}
												max={new Date().toISOString().split('T')[0]}
											/>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name={`students.${index}.gender`}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												Gender <Asterisk />
											</FieldLabel>

											<Select
												name={field.name}
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													id={field.name}
													disabled={isPending}
													aria-invalid={fieldState.invalid}
												>
													<SelectValue placeholder='Select Gender' />
												</SelectTrigger>

												<SelectContent position='popper'>
													{genders.map(gender => (
														<SelectItem
															key={gender}
															value={gender}
														>
															{gender}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</FieldGroup>

							<FieldGroup className='items-end'>
								<Button
									type='button'
									variant='destructive'
									disabled={fields.length === 1}
									onClick={() => remove(index)}
									className='w-max'
								>
									Remove Student
								</Button>
							</FieldGroup>
						</FieldSet>
					))}

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() =>
								append({
									school_year: '',
									grade_level: '',
									student_type: '',
									first_name: '',
									middle_name: '',
									last_name: '',
									suffix: undefined,
									lrn: '',
									adress: '',
									date_of_birth: '',
									gender: 'Male'
								})
							}
						>
							Add Student
						</Button>

						<Button
							type='button'
							disabled={isPending || !isStudentStepValid}
							onClick={() => setEnrollmentStep('Parent Information')}
						>
							Continue to Parents Information
						</Button>
					</div>
				</TabsContent>

				<TabsContent
					value='Parent Information'
					className='bg-card rounded-lg p-5 space-y-4'
				>
					<FieldSet className='gap-4'>
						<FieldTitle className='text-muted-foreground'>
							Parent Information
						</FieldTitle>

						<FieldGroup className='flex-row gap-3'>
							{(
								[
									{
										name: 'parent_first_name',
										label: 'First Name',
										placeholder: 'John'
									},
									{
										name: 'parent_middle_name',
										label: 'Middle Name',
										placeholder: 'Joseph'
									},
									{
										name: 'parent_last_name',
										label: 'Last Name',
										placeholder: 'Doe'
									}
								] as const
							).map(({ name, label, placeholder }) => (
								<Controller
									key={name}
									name={name}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>
												{label} <Asterisk />
											</FieldLabel>

											<Input
												{...field}
												id={field.name}
												disabled={isPending}
												aria-invalid={fieldState.invalid}
												placeholder={placeholder}
											/>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							))}

							<Controller
								name='parent_suffix'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Suffix
										</FieldLabel>

										<Select
											name={field.name}
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id={field.name}
												disabled={isPending}
												aria-invalid={fieldState.invalid}
											>
												<SelectValue placeholder='Select Suffix' />
											</SelectTrigger>

											<SelectContent position='popper'>
												{suffixes.map(suffix => (
													<SelectItem key={suffix} value={suffix}>
														{suffix}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>

						<FieldGroup className='flex-row gap-3'>
							<Controller
								name='parent_gender'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Gender <Asterisk />
										</FieldLabel>

										<Select
											name={field.name}
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id={field.name}
												disabled={isPending}
												aria-invalid={fieldState.invalid}
											>
												<SelectValue placeholder='Select Gender' />
											</SelectTrigger>

											<SelectContent position='popper'>
												{genders.map(gender => (
													<SelectItem key={gender} value={gender}>
														{gender}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name='parent_address'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Home Address <Asterisk />
										</FieldLabel>

										<Input
											{...field}
											id={field.name}
											disabled={isPending}
											aria-invalid={fieldState.invalid}
											placeholder='123 Rizal Street, Barangay Poblacion, Daanbantayan, Cebu 6013, Philippines'
										/>

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>

						<FieldGroup className='flex-row gap-3'>
							{(
								[
									{
										name: 'parent_contact_number',
										label: 'Contact Number',
										placeholder: '09',
										type: 'text',
										minLength: 11,
										maxLength: 11
									},
									{
										name: 'parent_email',
										label: 'Email',
										placeholder: 'name@email.com',
										type: 'email'
									}
								] as const
							).map(
								({ name, label, placeholder, type, ...inputProps }) => (
									<Controller
										key={name}
										name={name}
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>
													{label} <Asterisk />
												</FieldLabel>

												<Input
													{...field}
													{...inputProps}
													type={type}
													id={field.name}
													disabled={isPending}
													aria-invalid={fieldState.invalid}
													placeholder={placeholder}
												/>

												{fieldState.invalid && (
													<FieldError
														errors={[fieldState.error]}
													/>
												)}
											</Field>
										)}
									/>
								)
							)}
						</FieldGroup>
					</FieldSet>

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setEnrollmentStep('Student Information')}
						>
							Previous
						</Button>

						<Button
							type='button'
							disabled={isPending || !isParentStepValid}
							onClick={() => setEnrollmentStep('Fee Settlement')}
						>
							Continue to Fee Settlement
						</Button>
					</div>
				</TabsContent>

				<TabsContent
					value='Fee Settlement'
					className='bg-card rounded-lg p-5 space-y-4'
				>
					<FieldSet className='gap-4'>
						<FieldGroup className='flex-row gap-3'>
							<Controller
								name='entrance_fee'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>
											Entrance Fee <Asterisk />
										</FieldLabel>

										<Input
											type='number'
											{...field}
											id={field.name}

											onChange={event =>
												field.onChange(Number(event.target.value))
											}
											disabled={isPending}
											aria-invalid={fieldState.invalid}
										/>

										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</FieldSet>

					<div className='flex justify-end gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setEnrollmentStep('Parent Information')}
						>
							Previous
						</Button>

						<Button
							type='submit'
							disabled={isPending || !isFeeSettlementStepValid}
						>
							Process Enrollment
						</Button>
					</div>
				</TabsContent>
			</form>
		</Tabs>
	);
}
