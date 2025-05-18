import React from 'react'
import { ArrowRight } from 'lucide-react'

import '../styles.css'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HomePage() {
  return (
    <div>
      <section className="min-h-screen flex flex-col items-center justify-center py-24 px-6 gap-6">
        <h1 className="text-5xl md:text-7xl max-w-[550px] text-center mx-auto font-bold">
          Simple <br />
          Contact Form
        </h1>
        <p className="text-xl text-gray-600 max-w-[550px] mx-auto text-center">
          Spam protected form submissions directly to your email inbox. No backend setup required.
          Only pay for what you use.
        </p>
        <p className="text-center w-fit text-xl mx-auto font-semibold">1 cent / email</p>
        <div className="flex items-center gap-4 mt-6">
          <Link href="/login">Login</Link>
          <Link href="/register">
            <Button>
              Get started <ArrowRight />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
