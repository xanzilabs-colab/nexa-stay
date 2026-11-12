update public.agents
set name = case slug
    when 'zola-williams' then 'Mark Williams'
    when 'lerato-khumalo' then 'Baldwin Khumalo'
    when 'matthew-naidoo' then 'Catherine Van der Merwe'
  end,
  updated_at = now()
where (slug = 'zola-williams' and name = 'Zola Williams')
   or (slug = 'lerato-khumalo' and name = 'Lerato Khumalo')
   or (slug = 'matthew-naidoo' and name = 'Matthew Naidoo');
