const Mandal = require('../models/Mandal')

const createMandal = async (req, res) => {
    try {
      console.log("req",req.body)
      const { mandalName, areas } = req.body;
      if (!mandalName || !Array.isArray(areas) || areas.length === 0) {
        return res.status(400).json({ message: 'Mandal name and areas are required' });
      }
  
      const newMandal = new Mandal({ mandalName, areas });
      await newMandal.save();
  
      res.status(201).json({ message: 'Mandal created successfully', data: newMandal });
    } catch (error) {
      console.error('Error creating mandal:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  const getAllMandals = async (req, res) => {
    try {
      const mandals = await Mandal.find().sort({ createdAt: -1 });
      res.status(200).json({ data: mandals });
    } catch (error) {
      console.error('Error fetching mandals:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getMandalById = async (req, res) => {
    try {
      const mandal = await Mandal.findById(req.params.id);
      if (!mandal) return res.status(404).json({ message: 'Mandal not found' });
  
      res.status(200).json({ data: mandal });
    } catch (error) {
      console.error('Error fetching mandal:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const updateMandal = async (req, res) => {
    try {
      const { mandalName, areas } = req.body;
  
      const mandal = await Mandal.findById(req.params.id);
      if (!mandal) return res.status(404).json({ message: 'Mandal not found' });
  
      if (mandalName) mandal.mandalName = mandalName;
      if (areas) mandal.areas = areas; // Replace entire structure
  
      await mandal.save();
  
      res.status(200).json({ message: 'Mandal updated successfully', data: mandal });
    } catch (error) {
      console.error('Error updating mandal:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deleteMandal = async (req, res) => {
    try {
      const mandal = await Mandal.findByIdAndDelete(req.params.id);
      if (!mandal) return res.status(404).json({ message: 'Mandal not found' });
  
      res.status(200).json({ message: 'Mandal deleted successfully' });
    } catch (error) {
      console.error('Error deleting mandal:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = {
    createMandal,
    getAllMandals,
    getMandalById,
    updateMandal,
    deleteMandal
  };
  