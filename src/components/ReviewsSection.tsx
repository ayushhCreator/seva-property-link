import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const reviews = [
  { name: 'Ajeet Kumar', city: 'Patna', text: 'BhumiSeva ne meri Khatiyan sirf 3 din mein nikal di. Bahut fast service!', rating: 5 },
  { name: 'Rina Chatterjee', city: 'Patna', text: 'Very professional service. Got my deed copy within a week. Highly recommended!', rating: 5 },
  { name: 'Prashant Deshmukh', city: 'Patna', text: 'Excellent rent agreement service. Quick, professional, and hassle-free!', rating: 5 },
  { name: 'Suman Devi', city: 'Patna', text: 'Mutation ka kaam bahut smooth hua. Team bahut helpful thi.', rating: 5 },
];

export default function ReviewsSection() {
  return (
    <section className="bg-secondary/30 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">What Our Clients Say</h2>
          <p className="mt-2 text-muted-foreground">Trusted by 500+ satisfied customers across India</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">"{r.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.city}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
