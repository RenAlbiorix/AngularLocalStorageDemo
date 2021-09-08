export interface DynamicFormDetail {
    id: number;
    formName: string;
    question: DynamicFormDetail[];
    questionType: number;
    option: optionDetail[];
}

export interface optionDetail {
    textValue: string;
}