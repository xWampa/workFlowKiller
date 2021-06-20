BEGIN;
CREATE TABLE IF NOT EXISTS users (
	id	INTEGER NOT NULL AUTO_INCREMENT,
	login	TEXT NOT NULL,
	name	TEXT NOT NULL,
	email	TEXT,
	passwd	TEXT NOT NULL,
	PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS workflows (
	id	INTEGER NOT NULL AUTO_INCREMENT,
	name	TEXT NOT NULL,
	PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tasks (
	id	INTEGER NOT NULL AUTO_INCREMENT,
	name	TEXT NOT NULL,
	workflow	INTEGER,
	PRIMARY KEY(id),
	FOREIGN KEY (workflow) REFERENCES workflows(id)
);
CREATE TABLE IF NOT EXISTS wftasks (
	id	INTEGER NOT NULL AUTO_INCREMENT,
	workflow	INTEGER NOT NULL,
	orderaaa	INTEGER NOT NULL,
	task	INTEGER NOT NULL,
	data	TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (workflow) REFERENCES workflows(id),
	FOREIGN KEY (task) REFERENCES tasks(id)
);
CREATE TABLE IF NOT EXISTS usertasks (
	id	INTEGER NOT NULL AUTO_INCREMENT,
	run	INTEGER NOT NULL,
	user	INTEGER NOT NULL,
	wftask	INTEGER NOT NULL,
	state	INTEGER NOT NULL,
	notes	TEXT,
	PRIMARY KEY (id),
	FOREIGN KEY (run) REFERENCES runs(id),
	FOREIGN KEY (user) REFERENCES users(id),
	FOREIGN KEY (wftask) REFERENCES wftasks(id)
);
CREATE TABLE IF NOT EXISTS runs (
	id	INTEGER NOT NULL AUTO_INCREMENT,
	workflow	INTEGER NOT NULL,
	user	INTEGER NOT NULL,
	state	INTEGER NOT NULL,
	usertask	INTEGER,
	PRIMARY KEY(id),
	FOREIGN KEY (workflow) REFERENCES workflows(id),
	FOREIGN KEY (usertask) REFERENCES usertasks(id),
	FOREIGN KEY (user) REFERENCES users(id)
);
INSERT INTO users VALUES (1,'admin','Administrador','root@wf-processor.com','admin');
INSERT INTO users VALUES (2,'juanito','Juan Sánchez','juan.sanchez@mycomp.com','12345');
INSERT INTO users VALUES (3,'pepito','Pepe López','pepe.lopez@gmail.com','patata');
INSERT INTO workflows VALUES (1,'Proceso1');
INSERT INTO wftasks VALUES (1,1,10,1,'Al Scrum Master');
INSERT INTO wftasks VALUES (2,1,20,4,'Reunión revisión del sprint');
INSERT INTO wftasks VALUES (3,1,30,3,'Requisitos software para las tareas del sprint.');
INSERT INTO tasks VALUES (1,'Enviar e-mail',NULL);
INSERT INTO tasks VALUES (2,'Redatar documento',NULL);
INSERT INTO tasks VALUES (3,'Revisar documento',NULL);
INSERT INTO tasks VALUES (4,'Planificar reunión',NULL);
INSERT INTO tasks VALUES (5,'Analizar funcionalidad',NULL);
INSERT INTO tasks VALUES (6,'Diseñar funcionalidad',NULL);
INSERT INTO tasks VALUES (7,'Implementar funcionalidad',NULL);
INSERT INTO tasks VALUES (8,'Redactar requisitos de sistema',NULL);
INSERT INTO tasks VALUES (9,'Diseñar pruebas de sistema',NULL);
INSERT INTO tasks VALUES (10,'Realizar pedido',NULL);
INSERT INTO tasks VALUES (11,'Enviar Factura',NULL);
INSERT INTO runs VALUES (1,1,2,2,NULL);
INSERT INTO usertasks VALUES (1,1,2,1,2,'');
INSERT INTO usertasks VALUES (2,1,2,2,1,NULL);
INSERT INTO usertasks VALUES (3,1,2,3,1,NULL);
CREATE INDEX IF NOT EXISTS usertaskstate ON usertasks (
	user,
	state
);
COMMIT;
