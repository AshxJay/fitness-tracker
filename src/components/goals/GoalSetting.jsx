import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { goalsService } from '../../services/goalsService';
import useStore from '../../store/useStore';
import './Goals.css';

const GoalSetting = () => {
  const addGoal = useStore((state) => state.addGoal);
  const [goal, setGoal] = useState({
    type: 'weight',
    name: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: 'kg',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    status: 'in-progress'
  });

  const goalTypes = [
    { value: 'weight', label: 'Weight Goal', unit: 'kg' },
    { value: 'strength', label: 'Strength Goal', unit: 'kg' },
    { value: 'endurance', label: 'Endurance Goal', unit: 'minutes' },
    { value: 'nutrition', label: 'Nutrition Goal', unit: 'calories' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal(prev => {
      const newGoal = { ...prev, [name]: value };
      if (name === 'type') {
        const selectedType = goalTypes.find(type => type.value === value);
        newGoal.unit = selectedType.unit;
      }
      return newGoal;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert string values to numbers
      const goalData = {
        ...goal,
        targetValue: Number(goal.targetValue),
        currentValue: Number(goal.currentValue)
      };
      
      const savedGoal = await goalsService.createGoal(goalData);
      addGoal(savedGoal);
      toast.success('Goal saved successfully!');
      // Reset form
      setGoal({
        type: 'weight',
        name: '',
        description: '',
        targetValue: '',
        currentValue: '',
        unit: 'kg',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: '',
        status: 'in-progress'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving goal');
    }
  };

  return (
    <div className="goals-container">
      <h2>Set New Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Goal Type:</label>
          <select
            name="type"
            value={goal.type}
            onChange={handleChange}
            required
          >
            {goalTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Goal Name:</label>
          <input
            type="text"
            name="name"
            value={goal.name}
            onChange={handleChange}
            placeholder="Enter goal name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={goal.description}
            onChange={handleChange}
            placeholder="Enter goal description"
          />
        </div>

        <div className="form-group">
          <label>Current Value ({goal.unit}):</label>
          <input
            type="number"
            name="currentValue"
            value={goal.currentValue}
            onChange={handleChange}
            placeholder={`Enter current value in ${goal.unit}`}
            required
          />
        </div>

        <div className="form-group">
          <label>Target Value ({goal.unit}):</label>
          <input
            type="number"
            name="targetValue"
            value={goal.targetValue}
            onChange={handleChange}
            placeholder={`Enter target value in ${goal.unit}`}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={goal.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Target Date:</label>
          <input
            type="date"
            name="targetDate"
            value={goal.targetDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="save-goals-btn">Save Goal</button>
      </form>
    </div>
  );
};

export default GoalSetting;
