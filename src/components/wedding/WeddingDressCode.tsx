export function WeddingDressCode() {
  const femaleColors = [
    { name: 'Шоколад', color: 'hsl(25, 30%, 35%)' },
    { name: 'Мокко', color: 'hsl(30, 25%, 45%)' },
    { name: 'Бежевый', color: 'hsl(35, 35%, 65%)' },
    { name: 'Кремовый', color: 'hsl(40, 40%, 80%)' },
    { name: 'Пудра', color: 'hsl(20, 20%, 85%)' },
    { name: 'Шампань', color: 'hsl(50, 40%, 92%)' }
  ];

  const maleColors = [
    { name: 'Черный', color: 'hsl(0, 0%, 10%)' },
    { name: 'Темно-серый', color: 'hsl(0, 0%, 30%)' },
    { name: 'Светло-серый', color: 'hsl(0, 0%, 65%)' },
    { name: 'Бежевый', color: 'hsl(35, 35%, 65%)' }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-secondary/20 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="staggered-fade text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">
            Дресс-код
          </h2>
        </div>

        <div className="staggered-fade mb-16">
          {/* Female Colors */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif text-primary mb-8 text-center">Для неё</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 max-w-2xl mx-auto">
              {femaleColors.map((colorItem, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="brush-stroke relative overflow-hidden rounded-xl aspect-square">
                    <div
                      className="absolute inset-0 brush-effect"
                      style={{ backgroundColor: colorItem.color }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-medium text-xs bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                        {colorItem.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Male Colors */}
          <div>
            <h3 className="text-2xl font-serif text-primary mb-8 text-center">Для него</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-xl mx-auto">
              {maleColors.map((colorItem, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="brush-stroke relative overflow-hidden rounded-xl aspect-square">
                    <div
                      className="absolute inset-0 brush-effect"
                      style={{ backgroundColor: colorItem.color }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white font-medium text-xs bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                        {colorItem.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="staggered-fade text-center">
          <div className="card-elegant rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-muted-foreground font-light leading-relaxed">
              Мы будем рады видеть вас в нарядах теплых оттенков нашей палитры. 
              Элегантность и стиль в благородных тонах подчеркнут торжественность момента
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}