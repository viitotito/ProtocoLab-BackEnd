import * as departmentService from "../services/department.service.js";

export async function createDepartment(req, res) {
  try {
    const department = await departmentService.createDepartment(
      req.user.companyId,
      req.body,
      req.t
    );

    return res.status(201).json({
      message: req.t("department:success.department_created"),
      data: department,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function listDepartments(req, res) {
  const departments = await departmentService.listDepartments(
    req.user.companyId
  );

  return res.json(departments);
}

export async function getDepartment(req, res) {
  try {
    const department = await departmentService.getDepartmentById(
      Number(req.params.id),
      req.user.companyId,
      req.t
    );

    return res.json(department);
  } catch (err) {
    return res.status(404).json({
      message: err.message,
    });
  }
}

export async function updateDepartment(req, res) {
  try {
    const department = await departmentService.updateDepartment(
      Number(req.params.id),
      req.user.companyId,
      req.body,
      req.t
    );

    return res.json({
      message: req.t("department:success.department_updated"),
      data: department,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function deleteDepartment(req, res) {
  try {
    const result = await departmentService.deleteDepartment(
      Number(req.params.id),
      req.user.companyId,
      req.t
    );

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}