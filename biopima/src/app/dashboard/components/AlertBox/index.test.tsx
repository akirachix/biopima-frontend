import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertBox from '.';




import '@testing-library/jest-dom';


describe('AlertBox', () => {
 it('does not render when methaneLevel is null', () => {
   const { container } = render(<AlertBox methaneLevel={null} />);
   expect(container).toBeEmptyDOMElement();
 });


 it('does not render when methaneLevel is 2 or below', () => {
   const { container } = render(<AlertBox methaneLevel={2} />);
   expect(container).toBeEmptyDOMElement();


   const { container: container2 } = render(<AlertBox methaneLevel={0} />);
   expect(container2).toBeEmptyDOMElement();
 });


 it('renders alert when methaneLevel is above 2', () => {
   render(<AlertBox methaneLevel={2.5} />);
   expect(screen.getByText('Methane Alert')).toBeInTheDocument();


   expect(screen.getByText((content, element) =>
     content.includes('High Methane Detected:') && element?.tagName.toLowerCase() === 'p'
   )).toBeInTheDocument();


   expect(screen.getByText(/Methane level at 2\.5 ppm/)).toBeInTheDocument();
 });


 it('formats methaneLevel to one decimal place', () => {
   render(<AlertBox methaneLevel={3.14159} />);
 
   expect(screen.getByText((content) =>
     content.includes('Methane level at') && content.includes('3.1') && content.includes('ppm')
   )).toBeInTheDocument();
 });
});
