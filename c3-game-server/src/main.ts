import { ExampleSharedClass } from "@shared/test-shared";
import { bootstrap } from "config/nest";
import { ExampleImportClass } from "example-import";

// debug to check that class imports work
console.log(new ExampleImportClass().value);
console.log(new ExampleSharedClass().value);

bootstrap();
