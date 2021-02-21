INSERT INTO public.auth_item(
	name, type, description, rule_name, data)
	VALUES ('public', 2, 'доступ без необхідності авторизації', null, null);
INSERT INTO public.auth_item(
	name, type, description, rule_name, data)
	VALUES ('user', 2, 'Початковий доступ. Отримують зареєстровані користувачі. Мають можливість працювати з сессією.', null, null);
INSERT INTO public.auth_item_child(
	parent, child)
	VALUES ('user', 'public');