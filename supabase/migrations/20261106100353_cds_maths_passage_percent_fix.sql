update public.question_passages set body = replace(body, chr(92) || '%', '%') where paper_id = 'cds-maths' and title = 'Questions 87–88';
