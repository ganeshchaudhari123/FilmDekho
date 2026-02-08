'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VIPPage() {
  const router = useRouter();

  const plans = [
    { id: '1', name: 'Weekly Access', price: '99', duration: '7 Days' },
    { id: '2', name: 'Monthly Access', price: '299', duration: '30 Days', popular: true },
    { id: '3', name: 'Annual Access', price: '999', duration: '365 Days' },
  ];

  return (
    <div style={{ flex: 1, paddingBottom: '80px' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', padding: '10px' }}
        >
          &larr;
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 auto' }}>VIP UPGRADE</h1>
      </div>

      <div style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '14px', color: '#777', marginBottom: '20px' }}>AVAILABLE PLANS</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                backgroundColor: plan.popular ? '#222' : '#111',
                border: plan.popular ? '2px solid #FFD700' : '1px solid #333',
                padding: '20px',
                borderRadius: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{plan.name}</h3>
                <p style={{ fontSize: '12px', color: '#777' }}>{plan.duration} Unlimited</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD700' }}>₹{plan.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="login-card" style={{ marginTop: '40px', width: '100%', padding: '25px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>MANUAL PAYMENT</h3>
          <p style={{ fontSize: '11px', color: '#777', marginBottom: '20px' }}>
            Pay via your favorite method and upload the transaction screenshot below.
          </p>

          <div style={{ backgroundColor: '#fff', width: '150px', height: '150px', margin: '0 auto 20px', padding: '10px' }}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=filmdekho@upi" alt="QR" />
          </div>

          <p style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '25px' }}>UPI ID: filmdekho@upi</p>

          <button className="gold-button">UPLOAD SCREENSHOT</button>
        </div>
      </div>
    </div>
  );
}
