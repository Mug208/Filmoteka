
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.Server.Models;
using Filmoteka.Server.Data;

public class ZanrsController : Controller
{
    private readonly AppDbContext _context;

    public ZanrsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: ZANRS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Zanrovi.ToListAsync());
    }

    // GET: ZANRS/Details/5
    public async Task<IActionResult> Details(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var zanr = await _context.Zanrovi
            .FirstOrDefaultAsync(m => m.Id == id);
        if (zanr == null)
        {
            return NotFound();
        }

        return View(zanr);
    }

    // GET: ZANRS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: ZANRS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Naziv,Filmovi")] Zanr zanr)
    {
        if (ModelState.IsValid)
        {
            _context.Add(zanr);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(zanr);
    }

    // GET: ZANRS/Edit/5
    public async Task<IActionResult> Edit(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var zanr = await _context.Zanrovi.FindAsync(id);
        if (zanr == null)
        {
            return NotFound();
        }
        return View(zanr);
    }

    // POST: ZANRS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(System.Guid? id, [Bind("Id,Naziv,Filmovi")] Zanr zanr)
    {
        if (id != zanr.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(zanr);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ZanrExists(zanr.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(zanr);
    }

    // GET: ZANRS/Delete/5
    public async Task<IActionResult> Delete(System.Guid? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var zanr = await _context.Zanrovi
            .FirstOrDefaultAsync(m => m.Id == id);
        if (zanr == null)
        {
            return NotFound();
        }

        return View(zanr);
    }

    // POST: ZANRS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(System.Guid? id)
    {
        var zanr = await _context.Zanrovi.FindAsync(id);
        if (zanr != null)
        {
            _context.Zanrovi.Remove(zanr);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool ZanrExists(System.Guid? id)
    {
        return _context.Zanrovi.Any(e => e.Id == id);
    }
}
