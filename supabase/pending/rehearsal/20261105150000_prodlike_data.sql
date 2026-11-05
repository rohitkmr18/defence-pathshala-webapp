-- Exact production distribution (exam, paper, subject → count), 5 Nov 2026
with dist(exam, paper, subject, n) as (values
 ('CAPF-AC','Paper I','Current Affairs',54),('CAPF-AC','Paper I','Economy',98),('CAPF-AC','Paper I','Environment',40),
 ('CAPF-AC','Paper I','General Mental Ability',112),('CAPF-AC','Paper I','Geography',112),('CAPF-AC','Paper I','History',129),
 ('CAPF-AC','Paper I','International Relations',10),('CAPF-AC','Paper I','Polity',85),('CAPF-AC','Paper I','Science',2),
 ('CAPF-AC','Paper I','Science & Technology',217),('CAPF-AC','Paper I','Security',14),
 ('CDS','General Knowledge','Current Affairs',178),('CDS','General Knowledge','Economy',182),('CDS','General Knowledge','Environment',51),
 ('CDS','General Knowledge','Geography',257),('CDS','General Knowledge','History',299),('CDS','General Knowledge','International Relations',26),
 ('CDS','General Knowledge','Polity',206),('CDS','General Knowledge','Science',1),('CDS','General Knowledge','Science & Technology',457),
 ('CDS','General Knowledge','Security',21)),
rows as (select d.exam, d.paper, d.subject, row_number() over (partition by d.exam order by d.subject, g) rn
         from dist d, generate_series(1, d.n) g)
insert into public.questions (question_id, exam, year, cycle, paper, q_num, subject, topic, question, opt_a, opt_b, opt_c, opt_d,
                              final_opt, content_status, content_version)
select exam || '_' || rn, exam, 2000 + rn / 125, case when exam = 'CDS' then (array['I','II'])[1 + (rn % 2)] else 'I' end,
       paper, rn, subject, subject, 'Q ' || rn, 'a','b','c','d', 'A',
       (array['UNCHECKED','SOURCE_MATCHED','WITHHELD'])[1 + (rn % 3)], 1 + (rn % 4)
from rows;
