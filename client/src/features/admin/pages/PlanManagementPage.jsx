import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import Modal from '../../../shared/components/Modal';
import Loader from '../../../shared/components/Loader';
import Badge from '../../../shared/components/Badge';
import adminService from '../services/adminService';
import { LEVELS } from '../../../shared/utils/constants';
import { formatCurrency } from '../../../shared/utils/helpers';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiStar } from 'react-icons/hi';

const PlanManagementPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    level: 'foundation',
    price: '',
    originalPrice: '',
    duration: 30,
    durationLabel: '1 Month',
    features: [''],
    isPopular: false,
    isActive: true,
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPlans();
      setPlans(response.data.data);
    } catch (err) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreate = () => {
    setForm({
      name: '',
      level: 'foundation',
      price: '',
      originalPrice: '',
      duration: 30,
      durationLabel: '1 Month',
      features: [''],
      isPopular: false,
      isActive: true,
    });
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEdit = (plan) => {
    setForm({
      name: plan.name,
      level: plan.level,
      price: plan.price,
      originalPrice: plan.originalPrice || '',
      duration: plan.duration,
      durationLabel: plan.durationLabel,
      features: plan.features?.length > 0 ? plan.features : [''],
      isPopular: plan.isPopular,
      isActive: plan.isActive,
    });
    setModal({ open: true, mode: 'edit', data: plan });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const cleanedForm = {
        ...form,
        features: form.features.filter((f) => f.trim() !== ''),
      };

      if (modal.mode === 'create') {
        await adminService.createPlan(cleanedForm);
        toast.success('Plan created successfully!');
      } else {
        await adminService.updatePlan(modal.data._id, cleanedForm);
        toast.success('Plan updated successfully!');
      }
      setModal({ open: false, mode: 'create', data: null });
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ''] });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm({ ...form, features: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  // Group plans by level
  const groupedPlans = {};
  plans.forEach((plan) => {
    if (!groupedPlans[plan.level]) groupedPlans[plan.level] = [];
    groupedPlans[plan.level].push(plan);
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] relative">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-x-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Subscription Plans
            </h1>
            <p className="text-gray-500 mt-1">
              Manage pricing plans for each CA level
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            Add Plan
          </button>
        </div>

        {loading ? (
          <Loader size="lg" text="Loading plans..." />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPlans).map(([level, levelPlans]) => {
              const levelInfo = LEVELS[level];
              return (
                <div key={level}>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>{levelInfo?.icon}</span>
                    {levelInfo?.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {levelPlans.map((plan) => (
                      <div
                        key={plan._id}
                        className={`card relative ${
                          !plan.isActive ? 'opacity-50' : ''
                        } ${plan.isPopular ? 'ring-2 ring-primary-500' : ''}`}
                      >
                        {plan.isPopular && (
                          <div className="absolute -top-2 right-4">
                            <Badge variant="primary" size="sm">
                              <HiStar className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {plan.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {plan.durationLabel} ({plan.duration} days)
                            </p>
                          </div>
                          <button
                            onClick={() => openEdit(plan)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mb-3">
                          {plan.originalPrice > plan.price && (
                            <span className="text-sm text-gray-400 line-through mr-2">
                              {formatCurrency(plan.originalPrice)}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-gray-900">
                            {formatCurrency(plan.price)}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {plan.features?.map((f, i) => (
                            <li
                              key={i}
                              className="text-xs text-gray-600 flex items-center gap-1"
                            >
                              <span className="text-green-500">✓</span> {f}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Badge
                            variant={plan.isActive ? 'success' : 'danger'}
                            size="sm"
                          >
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Plan Modal */}
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, mode: 'create', data: null })}
          title={modal.mode === 'create' ? 'Create Subscription Plan' : 'Edit Plan'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Foundation Quarterly"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="input-field"
                  required
                >
                  {Object.values(LEVELS).map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.icon} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: parseInt(e.target.value) || 0 })
                  }
                  className="input-field"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: parseFloat(e.target.value) || '' })
                  }
                  className="input-field"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      originalPrice: parseFloat(e.target.value) || '',
                    })
                  }
                  className="input-field"
                  min="0"
                  placeholder="For showing strikethrough"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration Label *
                </label>
                <input
                  type="text"
                  value={form.durationLabel}
                  onChange={(e) =>
                    setForm({ ...form, durationLabel: e.target.value })
                  }
                  className="input-field"
                  placeholder="e.g., 3 Months"
                  required
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) =>
                      setForm({ ...form, isPopular: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mark as Popular
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active
                  </span>
                </label>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="space-y-2">
                {form.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Feature ${index + 1}`}
                    />
                    {form.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>
                  setModal({ open: false, mode: 'create', data: null })
                }
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Saving...' : modal.mode === 'create' ? 'Create Plan' : 'Update Plan'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default PlanManagementPage;