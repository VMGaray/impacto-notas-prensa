import React, { useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [consultasRestantes, setConsultasRestantes] = useState(3);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('registro');

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // NAVEGACIÓN
  const Navigation = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '13px' }}>MMI</span>
          </div>
          <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '15px' }}>Analytics</span>
        </div>
        
        {/* SELECTOR PILL */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
          borderRadius: '50px',
          padding: '4px'
        }}>
          <button 
            onClick={() => setCurrentPage('inicio')}
            style={{
              padding: '10px 22px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: currentPage === 'inicio' ? 'white' : 'transparent',
              color: currentPage === 'inicio' ? '#111827' : '#6b7280',
              boxShadow: currentPage === 'inicio' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Inicio
          </button>
          <button 
            onClick={() => setCurrentPage('precios')}
            style={{
              padding: '10px 22px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: currentPage === 'precios' ? 'white' : 'transparent',
              color: currentPage === 'precios' ? '#111827' : '#6b7280',
              boxShadow: currentPage === 'precios' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Precios
          </button>
          <button 
            onClick={() => setCurrentPage('quienes-somos')}
            style={{
              padding: '10px 22px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: currentPage === 'quienes-somos' ? 'white' : 'transparent',
              color: currentPage === 'quienes-somos' ? '#111827' : '#6b7280',
              boxShadow: currentPage === 'quienes-somos' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Nosotros
          </button>
        </div>

        {/* Botón acceder */}
        {isRegistered ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>{consultasRestantes} consultas</span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: '600' }}>U</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => openModal('registro')}
            style={{
              padding: '10px 22px',
              backgroundColor: '#111827',
              color: 'white',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Acceder
          </button>
        )}
      </div>
    </div>
  );

  // PÁGINA INICIO
  const PaginaInicio = () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Gradientes de fondo */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '20%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '100px',
        right: '15%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '140px 24px 80px'
      }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '50px',
            marginBottom: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#14b8a6',
              borderRadius: '50%'
            }} />
            <span style={{ color: '#4b5563', fontSize: '14px', fontWeight: '500' }}>
              Análisis en tiempo real de medios canarios
            </span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 'bold',
            lineHeight: '1.1',
            marginBottom: '24px'
          }}>
            <span style={{ color: '#111827' }}>¿Funcionó mi</span><br />
            <span style={{
              background: 'linear-gradient(90deg, #14b8a6, #06b6d4, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              nota de prensa?
            </span>
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Descubre en segundos si tu comunicación llegó a radio y televisión de Canarias
          </p>
        </div>

        {/* Formulario */}
        <div style={{
          maxWidth: '520px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid #f3f4f6',
            padding: '32px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Organización
              </label>
              <input 
                type="text" 
                placeholder="Ej: Cabildo de Gran Canaria"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Tema de la nota
              </label>
              <input 
                type="text" 
                placeholder="Ej: Plan de empleo juvenil 2025"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                Fecha de publicación
              </label>
              <input 
                type="date" 
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(90deg, #14b8a6, #8b5cf6)',
              color: 'white',
              fontWeight: '600',
              fontSize: '15px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer'
            }}>
              Analizar impacto mediático
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid #f3f4f6'
            }}>
              <svg width="16" height="16" fill="#14b8a6" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                {isRegistered 
                  ? `${consultasRestantes} consultas disponibles hoy`
                  : 'Primera consulta gratuita · Sin registro'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Propuesta de valor */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '80px'
        }}>
          {[
            {
              icon: '📊',
              title: 'Datos reales',
              desc: 'Emisiones verificadas de radio y televisión canaria',
              gradient: 'linear-gradient(135deg, #14b8a6, #06b6d4)'
            },
            {
              icon: '⚡',
              title: 'Análisis instantáneo',
              desc: 'Resultados en segundos con inteligencia artificial',
              gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
            },
            {
              icon: '✓',
              title: 'Criterios objetivos',
              desc: 'Métricas homogéneas y metodología transparente',
              gradient: 'linear-gradient(135deg, #06b6d4, #14b8a6)'
            }
          ].map((item, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              border: '1px solid #f3f4f6',
              padding: '28px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: item.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '22px'
              }}>
                {item.icon}
              </div>
              <h3 style={{
                color: '#111827',
                fontWeight: '600',
                fontSize: '18px',
                marginBottom: '8px'
              }}>{item.title}</h3>
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontWeight: '500',
            marginBottom: '24px'
          }}>
            Usado por gabinetes de comunicación de
          </p>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '32px'
          }}>
            {['Gobierno de Canarias', 'Cabildo de Gran Canaria', 'Cabildo de Tenerife', 'Ayto. Las Palmas'].map((org, i) => (
              <span key={i} style={{ color: '#9ca3af', fontWeight: '500', fontSize: '16px' }}>{org}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // PÁGINA PRECIOS
  const PaginaPrecios = () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '900px',
        margin: '0 auto',
        padding: '140px 24px 80px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Planes{' '}
            <span style={{
              background: 'linear-gradient(90deg, #14b8a6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>simples</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Elige cómo quieres analizar tu impacto mediático</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px'
        }}>
          {/* Plan gratuito */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb',
            padding: '32px'
          }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ color: '#6b7280', fontWeight: '500', marginBottom: '8px' }}>Gratuito</h2>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>0 €</div>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Para probar la herramienta</p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
              {['3 consultas sin registro', '10 consultas con cuenta', 'Datos de los últimos 3 días', 'Radio y TV de Canarias', 'Veredicto y métricas básicas', 'Informe en texto plano'].map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#4b5563',
                  marginBottom: '16px',
                  fontSize: '15px'
                }}>
                  <span style={{ color: '#14b8a6', fontSize: '18px' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setCurrentPage('inicio')}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                fontWeight: '600',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Empezar gratis
            </button>
          </div>

          {/* Plan profesional */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 8px 30px rgba(139,92,246,0.15)',
            border: '2px solid #c4b5fd',
            padding: '32px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '6px 16px',
              background: 'linear-gradient(90deg, #14b8a6, #8b5cf6)',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '50px'
            }}>
              Recomendado
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ color: '#8b5cf6', fontWeight: '500', marginBottom: '8px' }}>Profesional</h2>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>A medida</div>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Según necesidades</p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0' }}>
              {['Consultas ilimitadas', 'Períodos ampliados', 'Historial completo', 'Detalle de programas', 'Comparativas históricas', 'Informes personalizados'].map((item, i) => (
                <li key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#4b5563',
                  marginBottom: '16px',
                  fontSize: '15px'
                }}>
                  <span style={{ color: '#8b5cf6', fontSize: '18px' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => openModal('contacto')}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(90deg, #14b8a6, #8b5cf6)',
                color: 'white',
                fontWeight: '600',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px'
              }}
            >
              Solicitar información
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginTop: '48px' }}>
          ¿Dudas? Escríbenos a <span style={{ color: '#8b5cf6' }}>administracion@mmi-e.com</span>
        </p>
      </div>
    </div>
  );

  // PÁGINA NOSOTROS
  const PaginaQuienesSomos = () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '800px',
        margin: '0 auto',
        padding: '140px 24px 80px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Más de{' '}
            <span style={{
              background: 'linear-gradient(90deg, #14b8a6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>20 años</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>monitorizando medios en Canarias</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          padding: '40px',
          marginBottom: '48px'
        }}>
          <p style={{ color: '#4b5563', fontSize: '17px', lineHeight: '1.8', marginBottom: '20px' }}>
            MMI Analytics es la división de análisis de datos de MMI, empresa canaria especializada en monitorización de medios desde 2003. Procesamos información de radio, televisión y medios digitales para organizaciones que necesitan datos fiables sobre su presencia mediática.
          </p>
          <p style={{ color: '#4b5563', fontSize: '17px', lineHeight: '1.8' }}>
            <strong style={{ color: '#111827' }}>«¿Funcionó mi nota de prensa?»</strong> es nuestra primera herramienta de acceso público. Permite a gabinetes de comunicación, administraciones y organizaciones evaluar de forma inmediata y objetiva el impacto de sus comunicaciones en radio y televisión de Canarias.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {[
            { num: '+20', label: 'años', color: '#14b8a6' },
            { num: '24/7', label: 'monitorización', color: '#8b5cf6' },
            { num: '100%', label: 'verificado', color: '#06b6d4' },
            { num: 'IA', label: 'inteligente', color: '#a855f7' }
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              padding: '24px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>
                {stat.num}
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a 
            href="mailto:administracion@mmi-e.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#374151',
              borderRadius: '50px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '15px'
            }}
          >
            administracion@mmi-e.com →
          </a>
        </div>
      </div>
    </div>
  );

  // MODAL
  const Modal = () => {
    if (!showModal) return null;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          maxWidth: '400px',
          width: '100%',
          padding: '32px',
          position: 'relative'
        }}>
          <button 
            onClick={() => setShowModal(false)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#6b7280'
            }}
          >
            ×
          </button>

          {modalType === 'registro' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '24px'
                }}>
                  👤
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Crear cuenta</h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Consigue 10 análisis adicionales</p>
              </div>

              <button style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '16px'
              }}>
                Continuar con Google
              </button>

              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', margin: '16px 0' }}>o con correo</div>

              <input 
                type="email" 
                placeholder="correo@ejemplo.com"
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  marginBottom: '12px',
                  boxSizing: 'border-box'
                }}
              />
              <input 
                type="password" 
                placeholder="Contraseña"
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  marginBottom: '16px',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                onClick={() => {
                  setIsRegistered(true);
                  setConsultasRestantes(10);
                  setShowModal(false);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(90deg, #14b8a6, #8b5cf6)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Crear cuenta
              </button>
            </>
          )}

          {modalType === 'contacto' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '24px'
                }}>
                  ✉️
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Contactar</h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Te enviaremos una propuesta</p>
              </div>

              {['Nombre *', 'Organización *', 'Correo *', 'Teléfono'].map((placeholder, i) => (
                <input 
                  key={i}
                  type="text" 
                  placeholder={placeholder}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    marginBottom: '12px',
                    boxSizing: 'border-box'
                  }}
                />
              ))}
              <button 
                onClick={() => setShowModal(false)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(90deg, #14b8a6, #8b5cf6)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                Enviar solicitud
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // FOOTER
  const Footer = () => (
    <div style={{
      backgroundColor: 'white',
      borderTop: '1px solid #f3f4f6',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '10px' }}>MMI</span>
          </div>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>© 2025 MMI Analytics</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="mailto:administracion@mmi-e.com" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>
            administracion@mmi-e.com
          </a>
          <a href="https://mmi-e.com" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>
            mmi-e.com
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <div style={{ flexGrow: 1 }}>
        {currentPage === 'inicio' && <PaginaInicio />}
        {currentPage === 'precios' && <PaginaPrecios />}
        {currentPage === 'quienes-somos' && <PaginaQuienesSomos />}
      </div>
      <Footer />
      <Modal />
    </div>
  );
}
