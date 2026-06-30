import * as departmentService from "../services/department.service.js";

export async function createDepartment(req, res) {
  try {
    const department = await departmentService.createDepartment(
      req.user.companyId,
      req.body
    );

    return res.status(201).json({
      message: req.t("department:success.department_created"),
      data: department,
    });

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function listDepartments(req, res) {
  try {
    const departments = await departmentService.listDepartments(
      req.user.companyId
    );

    return res.status(200).json(comments);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function listUsersByDepartment(req, res) {
  try {
    const users = await departmentService.listUsersByDepartment(
      Number(req.params.id),
      req.user.companyId
    );

    return res.status(200).json(users);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function getDepartment(req, res) {
  try {
    const department = await departmentService.getDepartmentById(
      Number(req.params.id),
      req.user.companyId
    );

    return res.status(200).json(department);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function updateDepartment(req, res) {
  try {
    const department = await departmentService.updateDepartment(
      Number(req.params.id),
      req.user.companyId,
      req.body
    );

    return res.status(200).json({
      message: req.t("department:success.department_updated"),
      data: department,
    });

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function deleteDepartment(req, res) {
  try {
    const result = await departmentService.deleteDepartment(
      Number(req.params.id),
      req.user.companyId
    );

    return res.json(result);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}