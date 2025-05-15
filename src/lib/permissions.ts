import { createAccessControl } from "better-auth/plugins/access";
import { adminAc } from "better-auth/plugins/admin/access";

// Расширенное определение разрешений, включая операции с мандатами
export const statement = {
    // Стандартные ресурсы
    project: ["create", "share", "update", "delete"],
    form: ["create", "update", "delete", "assign"],
    form_field: ["create", "update", "delete"],
    form_template: ["create", "update", "delete"],
    file: ["create", "update", "delete", "download", "share"],
    file_folder: ["create", "update", "delete"],
    review_flow: ["create", "update", "close"],
    comment: ["create", "update", "delete"],

    // Организация и пользователи
    organization: ["create", "update", "delete", "invite", "remove"],
    member: ["invite", "remove", "update_role"],
} as const;

export const ac = createAccessControl(statement);

// Роль обычного пользователя (член организации)
export const member = ac.newRole({
    project: ["create"],
    form: ["create"],
    file: ["create", "download", "share"],
    file_folder: ["create"],
});

// Роль исполнителя
export const executor = ac.newRole({
    ...member.statements,
    form: ["create", "update"],
});

// Роль рецензента
export const reviewer = ac.newRole({
    ...executor.statements,
    form: ["create", "update"],
    review_flow: ["update", "close"],
    comment: ["create", "update", "delete"],
});

// Роль администратора
export const admin = ac.newRole({
    ...adminAc,
    ...reviewer.statements,
    project: ["create", "update", "delete", "share"],
    form: ["create", "update", "delete", "assign"],
    form_field: ["create", "update", "delete"],
    form_template: ["create", "update", "delete"],
    file: ["create", "update", "delete", "download", "share"],
    file_folder: ["create", "update", "delete"],
    organization: ["update"],
    member: ["invite", "remove", "update_role"],
});

// Роль владельца организации
export const owner = ac.newRole({
    ...admin.statements,
    organization: ["create", "update", "delete", "invite", "remove"],
});
