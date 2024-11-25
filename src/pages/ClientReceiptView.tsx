import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Phone, Mail, Globe } from 'lucide-react';
import { Order } from '../types/order';
import { getOrderById } from '../services/orderService';
import { getReceiptTemplate } from '../services/receiptService';

export function ClientReceiptView() {
  const { orderId, receiptId } = useParams<{ orderId: string; receiptId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [template, setTemplate] = useState(getReceiptTemplate());

  useEffect(() => {
    if (orderId) {
      const orderData = getOrderById(orderId);
      if (orderData) {
        setOrder(orderData);
      } else {
        navigate('/404');
      }
    }
  }, [orderId, navigate]);

  if (!order) return null;

  const receipt = order.receipts?.find(r => r.id === receiptId);
  if (!receipt) return null;

  const formatDimensions = (item: any) => {
    return `${item.height}"H x ${item.width}"W x ${item.depth}"D`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {template.businessInfo.name}
                </h1>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    <span className="whitespace-pre-line">{template.businessInfo.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{template.businessInfo.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{template.businessInfo.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{template.businessInfo.website}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-indigo-50 rounded-lg px-4 py-2">
                  <h2 className="text-lg font-semibold text-indigo-700">RECEIPT</h2>
                  <p className="text-sm text-indigo-600">#{receipt.id.slice(0, 8)}</p>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Date: {new Date(receipt.createdAt).toLocaleDateString()}</p>
                  <p>Due Date: {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bill To</h2>
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">{order.clientName}</p>
                  <p className="whitespace-pre-line mt-2">{order.installationAddress}</p>
                  <p className="mt-2">{order.phone}</p>
                  <p>{order.email}</p>
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
                <div className="text-gray-600">
                  <p><span className="font-medium">Order ID:</span> {order.id.slice(0, 8)}</p>
                  <p><span className="font-medium">Project Name:</span> {order.projectName}</p>
                  <p><span className="font-medium">Payment Status:</span> {receipt.status.toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          {template.columns.spaceName && (
            <div className="p-8 border-b border-gray-200">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Space</th>
                    {template.columns.productType && (
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Product</th>
                    )}
                    {template.columns.materialName && (
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Material</th>
                    )}
                    {template.columns.dimensions && (
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Dimensions</th>
                    )}
                    {template.columns.price && (
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Price</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-4">
                        <p className="text-gray-900">{item.spaceName}</p>
                      </td>
                      {template.columns.productType && (
                        <td className="py-4 px-4 text-gray-900">{item.productId}</td>
                      )}
                      {template.columns.materialName && (
                        <td className="py-4 px-4 text-gray-900">{item.material}</td>
                      )}
                      {template.columns.dimensions && (
                        <td className="py-4 px-4 text-gray-900">{formatDimensions(item)}</td>
                      )}
                      {template.columns.price && (
                        <td className="py-4 px-4 text-right text-gray-900">${item.price.toFixed(2)}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan={5} className="py-4 px-4 text-right">
                      <p className="text-gray-600">Payment ({receipt.paymentPercentage}% of total order)</p>
                      <p className="text-xl font-bold text-indigo-600 mt-2">
                        ${receipt.amount.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="p-8">
            <div className="text-sm text-gray-600">
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                <p className="whitespace-pre-line">{template.footer.termsAndConditions}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center italic">
                <p className="whitespace-pre-line">{template.footer.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}