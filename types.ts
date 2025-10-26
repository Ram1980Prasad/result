export enum Gender {
    MALE = 'पुरुष',
    FEMALE = 'स्त्री',
    OTHER = 'इतर'
}

export enum Category {
    OPEN = 'खुला',
    OBC = 'इतर मागासवर्गीय',
    SC = ' अनुसूचित जाती',
    ST = 'अनुसूचित जमाती',
    VJ = 'विमुक्त जाती',
    NT = 'भटक्या जमाती'
}

export interface SubjectScores {
    formative: number | string;
    summative: number | string;
    total: number | string;
    grade: string;
}

export interface Marks {
  [subjectName: string]: SubjectScores;
}

export interface Student {
    id: string; // unique id for react key
    srNo: number;
    name: string;
    gender: Gender;
    category: Category;
    class: string;
    attendance: number | string;
    marks: Marks;
}