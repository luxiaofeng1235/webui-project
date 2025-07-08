const { body, validationResult } = require('express-validator');
const Table = require('../models/Table');

class TableController {
  static validateTable = [
    body('table_number').notEmpty().withMessage('桌台编号不能为空'),
    body('name').notEmpty().withMessage('桌台名称不能为空'),
    body('capacity').isInt({ min: 1 }).withMessage('容量必须是大于0的整数'),
    body('status').optional().isIn(['available', 'occupied', 'reserved', 'maintenance']).withMessage('状态值无效')
  ];

  static async getAll(req, res) {
    try {
      const { status } = req.query;
      const tables = await Table.getAll(status);
      
      res.json({
        success: true,
        data: { tables }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const table = await Table.findById(id);
      
      if (!table) {
        return res.status(404).json({
          success: false,
          message: '桌台不存在'
        });
      }

      res.json({
        success: true,
        data: { table }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '输入验证失败',
          errors: errors.array()
        });
      }

      const { table_number, name, capacity, location, status = 'available' } = req.body;

      // 检查桌台编号是否已存在
      const existingTable = await Table.findByTableNumber(table_number);
      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: '桌台编号已存在'
        });
      }

      const tableId = await Table.create({
        table_number,
        name,
        capacity,
        location,
        status
      });

      const table = await Table.findById(tableId);

      res.status(201).json({
        success: true,
        message: '桌台创建成功',
        data: { table }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: '输入验证失败',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { table_number, name, capacity, location, status } = req.body;

      // 检查桌台是否存在
      const existingTable = await Table.findById(id);
      if (!existingTable) {
        return res.status(404).json({
          success: false,
          message: '桌台不存在'
        });
      }

      // 如果修改了桌台编号，检查新编号是否已存在
      if (table_number !== existingTable.table_number) {
        const duplicateTable = await Table.findByTableNumber(table_number);
        if (duplicateTable) {
          return res.status(400).json({
            success: false,
            message: '桌台编号已存在'
          });
        }
      }

      const success = await Table.update(id, {
        table_number,
        name,
        capacity,
        location,
        status
      });

      if (!success) {
        return res.status(500).json({
          success: false,
          message: '更新失败'
        });
      }

      const table = await Table.findById(id);

      res.json({
        success: true,
        message: '桌台更新成功',
        data: { table }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      // 检查桌台是否存在
      const table = await Table.findById(id);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: '桌台不存在'
        });
      }

      // 检查桌台是否有未完成的订单
      const hasActiveOrders = await Table.hasActiveOrders(id);
      if (hasActiveOrders) {
        return res.status(400).json({
          success: false,
          message: '该桌台有未完成的订单，无法删除'
        });
      }

      const success = await Table.delete(id);
      if (!success) {
        return res.status(500).json({
          success: false,
          message: '删除失败'
        });
      }

      res.json({
        success: true,
        message: '桌台删除成功'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['available', 'occupied', 'reserved', 'maintenance'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: '无效的状态值'
        });
      }

      // 检查桌台是否存在
      const table = await Table.findById(id);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: '桌台不存在'
        });
      }

      const success = await Table.updateStatus(id, status);
      if (!success) {
        return res.status(500).json({
          success: false,
          message: '状态更新失败'
        });
      }

      const updatedTable = await Table.findById(id);

      res.json({
        success: true,
        message: '桌台状态更新成功',
        data: { table: updatedTable }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = TableController;
